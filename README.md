# usersDB_RESTAPI
File structure:Due to the small size of project file strucure is not too complex 
         1.the index.js files is the main root file.
         2.Post.js is the mongoose Schema for the User Post.
         3.User.js is the mongoose Schema for the User. 

Steps to Run the App
    1. clone the repository
    2. download the node modules (``` npm i ```)
    3. in the terminal fire a command ``` nodemon  index.js ```
    4. Now on to sending request By Postman


1. POST:/user 
    To add the new user to the Database
    send the Data as JSON raw body the JSON looks like this
    ``` 
       {
          "name":"abc",
          "email":"abc@gmail.com",
          "password":"12345"
       
       }
     ```
     Note : ** email should be unique **

2. GET:/user
     To Get all the users Info in the Database simply send the GET request to /user 

3. GET:/post
     To Get all posts in the Database send a simple GET request to /post

4. POST:/post
     to add a post for a user send the Data as JSON raw body
     format:
     ```
        {
           "user":"ObjectId(<id of any user>)",
           "text":"lorem ipsum"
        }
     ```   

5. POST:/like
      to add a like to a post by a user
      format:
      ```
         {
            "userId":"ObjectId(<id of the user liking the post>)",
            "postId":"ObjectId(<id of the post being liked>)"
         }
      ```
      
6. GET:/famous 
      to get the top 10 most liked posts
      
      
Note:also the Like route has a extra function to do that it will check if it user generally gets 100 
     likes for his posts and if any post gets 500 likes then we are sending a mail to him about the post becoming famous.      



      
        


    
