# Question Answers

1. Notice anything new in our ``.gitignore``? There are actually
multiple ``.gitignore`` files in this project. Where are they?
Why might we have more than one, and how do they interact?
    - There is a `.gitignore` file in the root of the repo, one in the `client` directory, and one in the `server` directory.
    - The one in the root is for things we want to ignore across the entire project, while the ones in the `client` and `server` directories are for items we want to only ignore for those sub-projects.
2. Note also that there are now multiple ``build.gradle`` files
as well! Why is this?
    - There is the `build.gradle` in the root of the project which just imports both sub-projects.
    - The server project has a `build.gradle` to build the Java-based server and the client project has its own `build.gradle` to handle the node and yarn stuff related to the client.
3. How does the navbar work in this project? Is our SparkJava server
the only thing doing routing?
    - The navbar component has links to the frontend pages, which are references to Angular's routes.
    - These links don't actually go to new HTML pages, but rather tell Angular what to display.
    - `app.routes.ts` contains the routes to the various pages (components) in the frontend.
    - This makes it so when you go to different URLS on the frontend, it changes the view being displayed accordingly.
    - The routing done by the Spark server is only for the API.
4. What does the `user-list.service.ts` do? Why is it not just done in
the `user-list.component.ts`?
    - It provides an implementation for the search function in the web page by importing the methods, providing the getUsers() and getUsersByID() functionality. It can't be done in the user component because that's where all of the declarations are made for the user type and where the methods are used.
