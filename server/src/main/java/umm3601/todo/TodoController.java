package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoException;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    /**
     * Construct a controller for todos.
     *
     * @param database the database containing todo data
     */

    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }

    /**
     * Get a JSON response with a a specific todo from the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getTodo(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String todo;
        try {
            todo = getTodo(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested todo id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (todo != null) {
            return todo;
        } else {
            res.status(404);
            res.body("The requested todo with id " + id + " was not found");
            return "";
        }
    }

    /**
     * Get the single todo specified by the `id` parameter in the request.
     *
     * @param id the Mongo ID of the desired tpdp
     * @return the desired todo as a JSON object if the todo with that ID is found,
     * and `null` if no todo with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonUsers
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonUsers.iterator();
        if (iterator.hasNext()) {
            Document user = iterator.next();
            return user.toJson();
        } else {
            // We didn't find the desired user
            return null;
        }
    }

    /**
     * @param req
     * @param res
     * @return an array of todos in JSON formatted String
     */
    public String getTodos(Request req, Response res)
    {
        res.type("application/json");
        return getTodos(req.queryMap().toMap());
    }

    /**
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();


        if (queryParams.containsKey("owner")) {
            filterDoc = filterDoc.append("owner", queryParams.get("owner")[0]);
        }
        if (queryParams.containsKey("status")) {
            filterDoc = filterDoc.append("status", queryParams.get("status")[0].equalsIgnoreCase("complete") || queryParams.get("status")[0].equalsIgnoreCase("true"));
        }
        if (queryParams.containsKey("category")) {
            filterDoc = filterDoc.append("category", queryParams.get("category")[0]);
        }
        if (queryParams.containsKey("contains")) {
            filterDoc = filterDoc.append("body", Pattern.compile(queryParams.get("contains")[0], Pattern.CASE_INSENSITIVE));
            System.out.println(filterDoc);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        if(queryParams.containsKey("orderBy")) {
            matchingTodos.sort(Sorts.ascending(queryParams.get("orderBy")[0]));
        }

        if(queryParams.containsKey("limit")) {
            matchingTodos.limit(Integer.parseInt(queryParams.get("limit")[0]));
        }

        return JSON.serialize(matchingTodos);
    }

    /**
     *
     * @param req
     * @param res
     * @return
     */
    public boolean addNewTodo(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String owner = dbO.getString("owner");
                    //For some reason age is a string right now, caused by angular.
                    //This is a problem and should not be this way but here ya go
                    boolean status = dbO.getBoolean("status");
                    String body = dbO.getString("body");
                    String category = dbO.getString("category");

                    if (owner == null || body == null || category == null) {
                        throw new NullPointerException();
                    }

                    System.err.println("Adding new todo [owner=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');
                    return addNewTodo(owner, status, body, category);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new user request failed.");
                    return false;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return false;
        }
    }

    public boolean addNewTodo(String owner, boolean status, String body, String category) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", status);
        newTodo.append("body", body);
        newTodo.append("category", category);

        try {
            todoCollection.insertOne(newTodo);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }

        return true;
    }

    public String todoSummary(Request req, Response res) {
        res.type("application/json");
        AggregateIterable<Document> completePercentTotal = completePercentbyField(null);
        AggregateIterable<Document> completePercentCategory = completePercentbyField("$category");
        AggregateIterable<Document> completePercentOwner = completePercentbyField("$owner");

        Document summary = new Document();
        summary.append("percentToDosComplete", completePercentTotal.first().get("percentComplete"));
        summary.append("categoriesPercentComplete", StreamSupport.stream(completePercentCategory.spliterator(), false).collect(Collectors.toMap(x -> x.get("_id"), x -> x.get("percentComplete"))));
        summary.append("ownersPercentComplete", StreamSupport.stream(completePercentOwner.spliterator(), false).collect(Collectors.toMap(x -> x.get("_id"), x -> x.get("percentComplete"))));

        return summary.toJson();
    }

    public AggregateIterable<Document> completePercentbyField(String field) {
        return todoCollection.aggregate(
            Arrays.asList(
                Aggregates.group(field, Accumulators.sum("count", 1), Accumulators.sum("numberComplete", new Document("$cond", Arrays.asList("$status", 1, 0)))),
                Aggregates.project(Projections.fields(
                    Projections.computed("percentComplete",
                        new Document("$divide", Arrays.asList("$numberComplete", "$count")))
                ))
            ));
    }
}
