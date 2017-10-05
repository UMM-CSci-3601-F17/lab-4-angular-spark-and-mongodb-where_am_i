# CSCI 3601 Lab #4 - Answers 

##1.What do we do in the server and UserController constructor to set up our connection to the development database?
We re-implement the ToDo API. This time pulling data from MongoDB rather than from a flat JSON file.

##2.How do we retrieve a user by ID in the UserController.getUser(String) method?
It creates a "document" type object and the document type object can be iterated.It goes through all the user and try to find one that matches the ID.

##3.How do we retrieve all the users with a given age in UserController.getUser(Map...)?What's the role of filterDoc in that method?
By detecting the word "age" in the input map, the client will look for the users that have the age matched. filterDoc is a Document type
that can be iterated for filtering. It matches the result by the parameter "age"

##4.What are these Document objects that we use in the UserController? Why and how are we using them?
They are temporary objects, We use them to iterate and filter our data.

##5.what does UserControllerSpec.clearAndPopulateDb do?
clearAndPopulateDb is the method we are using to avoid for testing on the actual data. It give new data instead of letting us using the data from database.

##6.What's being tested in UserControllerSpec.getUsersWhoAre37()? How is that being tested?
It works exactly as the "age" parameter. It filter out the users whose age is 37.
