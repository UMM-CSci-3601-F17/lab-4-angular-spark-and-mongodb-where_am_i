package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class TodoControllerSpec {

    private TodoController todoController;
    private ObjectId exampleTodoID;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{" +
            "        \"owner\": \"Blanche\",\n" +
                "        \"status\": false,\n" +
                "        \"body\": \"In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.\",\n" +
                "        \"category\": \"software design\"\n" +
                "}"));
        testTodos.add(Document.parse("{" +
            "        \"owner\": \"Fry\",\n" +
            "        \"status\": false,\n" +
            "        \"body\": \"Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.\",\n" +
            "        \"category\": \"video games\"\n" +
            "}"));
        testTodos.add(Document.parse("{" +
            "        \"owner\": \"Fry\",\n" +
            "        \"status\": true,\n" +
            "        \"body\": \"Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.\",\n" +
            "        \"category\": \"homework\"\n" +
            "}"));

        exampleTodoID = new ObjectId();
        BasicDBObject exampleTodo = new BasicDBObject("_id", exampleTodoID);
        exampleTodo = exampleTodo.append("owner", "Barry")
            .append("status", false)
            .append("body", "Nisi sit non non sunt veniam pariatur. Elit reprehenderit aliqua consectetur est dolor officia et adipisicing elit officia nisi elit enim nisi.")
            .append("category", "homework");

        todoDocuments.insertMany(testTodos);
        todoDocuments.insertOne(Document.parse(exampleTodo.toJson()));

        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    private static String getID(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("_id")).getValue();
    }

    private static String getCategory(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("category")).getValue();
    }

    @Test
    public void getAllUsers() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Blanche", "Fry", "Fry", "Barry");
        assertEquals("Owners should match", expectedOwners, owners);

        List<String> categories = docs
            .stream()
            .map(TodoControllerSpec::getCategory)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedCategories = Arrays.asList("software design", "video games", "homework", "homework");
        assertEquals("Categorie should match", expectedCategories, categories);
    }

    @Test
    public void getTodobyId() {
        String jsonResult = todoController.getTodo(exampleTodoID.toHexString());
        Document exampleTodoDoc = Document.parse(jsonResult);
        assertEquals("Owner should match", "Barry", exampleTodoDoc.get("owner"));
        assertEquals("Category should match", "homework", exampleTodoDoc.get("category"));
    }

}
