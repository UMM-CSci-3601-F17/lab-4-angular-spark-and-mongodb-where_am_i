# CSCI 3601 Lab #4 - Answers 

1. What do we do in the `Server` and `UserController` constructors to set up our connection to the development database?
    - In the `Server` class, a MongoClient object is created and used to get the database we are using. The database is passed to the `UserController` class when an instance of it is created. The name of the database connected to is stored in a String called `databaseName `. 
    - In `UserController` the database passed in is used to get the `users` collection.
2. How do we retrieve a user by ID in the `UserController.getUser(String)` method?
    - It creates a `FindIteratable` that has mongo search the `userCollection` and look for the specific ID that was passed in.
    - It takes the first result in that iteratable and returns that user data. If the iteratable does not contain anything it returns null.
3. How do we retrieve all the users with a given age in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that method?
    - The `filterDoc` is a document that is used to list all the filters mongo will apply.
    - It checks if an age was passed into the request and if so adds `{"age", targetAge}` to the `filterDoc` where `targetAge` is the passed in string age converted to an integer.
    - It then runs the mongo `find`method on the user collection passing in `filterDoc` and returns the returned `FindIteratable<Document>` as JSON.
4. What are these `Document` objects that we use in the `UserController`? Why and how are we using them?
    - a `Document` from Mongo BSON is a wrapper around a Map that is used to store key pairs. We are using them to store filter paramaters and user data.
5. What does `UserControllerSpec.clearAndPopulateDb` do?
    - It clears the test database and populates it with a defined set of new data.
    - It allows us to avoid for testing on the actual data. It gives a new set of data in the test database for each test.
6. What's being tested in `UserControllerSpec.getUsersWhoAre37()`? How is that being tested?
    - Its testing the age filter by passing the argument of `age=37` to the `userController.getUsers` method.
    - It checks that the returned array of users contains 2 users and that their names are the correct names of those with that age.
