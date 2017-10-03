package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

import java.util.Iterator;
import java.util.Map;
import java.util.regex.Pattern;

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

        if(queryParams.containsKey("limit")) {
            matchingTodos.limit(Integer.parseInt(queryParams.get("limit")[0]));
        }

        return JSON.serialize(matchingTodos);
    }

}
