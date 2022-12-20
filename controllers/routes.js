// ! Variable and router set up ------------------------------------------
// router variable imports the Router Engine from Express
const router = require("express").Router();
// setting up access to our database
const db = require("../api/blog.json");
// fs needed for functionality
const fs = require("fs");
// the path we will take to access our "database"
const dbPath = "./api/blog.json";

// ! End point for ALL POSTS------------------------------------------
// Create endpoint that will show all posts
// Endpoint that will display all blog posts from the database. In lieu of a database, we use our `blog.json` file.
// use a get for this
router.get("/", (req, res) => {
  try {
    // if succesful will respond and show the entire database of blogposts.
    res.status(200).json({
      db,
    });
    // otherwise will catch the error and alert the client of the erroe
  } catch (err) {
    res.status(500).json({
      status: `Error: ${err}`,
    });
  }
});

// ! Endpoint for ONE POST BY ID ----------------------------------------
// Endpoint that will display one comment from the database selected by its `post_id`
// Use get to retrieve the blogpost
router.get("/:id", (req, res) => {
  try {
    // setting id to the request params id
    let { id } = req.params;
    // filtering the database and looking for a post id that matches the param id. Setting result equal to the filtered data.
    let result = db.filter((i) => i.post_id == id);
    // If a match is found, Will tell us where and also show the matching singular post.
    res.status(200).json({
      status: `Found item at id: ${id}`,
      result,
    });
    // If no match is found the catch will catch it and display the error to the client.
  } catch (err) {
    res.status(500).json({
      error: `${err}`,
    });
  }
});

// ! Create a new blog post----------------------------------------------
// Endpoint that will allow us to create a new entry which will be appended to the `.json` file's outermost array.
// using post to create a new post
router.post("/", (req, res) => {
  try {
    // setting blogItem to the requests body (coming from postman)
    const blogItem = req.body;
    // reading the data
    fs.readFile(dbPath, (err, data) => {
      // if there's an error will throw an error
      if (err) throw err;
      // Parsing the JSON data so we can access it and setting db to it
      // The process of converting a JSON object in text format to a Javascript object that can be used in VScode
      const db = JSON.parse(data);
      // pushing the new item into the array
      db.push(blogItem);
      // Writing the file so it is saved with our changes. Need to stringify Json to respond to the client.
      // The JSON.stringify() method converts a JavaScript value to a JSON string,
      fs.writeFile(dbPath, JSON.stringify(db), () => null);
    });
    // If succesfull will respond the status and see the new blog item.
    res.status(201).json({
      status: "New item created",
      blogItem,
    });
    // If unsuccessful will catch it and respond with an error
  } catch (err) {
    res.status(500).json({
      error: `${err}`,
    });
  }
});
// ! Update endpoint using query to grab. Directions say grab from query rather than param this means in postamn it will have to be /query?id= whatever number you are trying to grab.
// Endpoint that will allow us to update an existing entry once a match has been found. The search should be done via a query parameter, whereas update information should be enclosed within the body.
// using put to edit a blog post
router.put("/query", (req, res) => {
  try {
    //  setting constant id to the query id
    const id = Number(req.query.id);
    // the constant blogPost is set to the request body (in postman)
    const blogPost = req.body;
    // declaring result out here so we can later access it
    let result;
    // reading the database file
    fs.readFile(dbPath, (err, data) => {
      // in case of an error will throw an error
      if (err) throw err;
      // Parsing the JSON data so we can access it and setting db to it
      const db = JSON.parse(data);
      // creating a for each loop to find a matching id within our database
      db.forEach((element, index) => {
        //  if a match is found
        if (element.post_id === id) {
          // that post is grabbed and rewritten as the edited blogpost (coming from postman)
          db[index] = blogPost;
          // setting our result to the blogPost so we can put it in the response
          result = blogPost;
          // Writing the file so it is saved with our changes. Need to stringify Json to respond to the client.
          fs.writeFile(dbPath, JSON.stringify(db), (err) => console.log(err));
        }
      });
      // If a result exists, aka if a match was found will respond with a message and the updated post.
      result
        ? res.status(200).json({
            status: `ID: ${id} succesfully modified`,
            object: result,
          })
        : // if not found will get the status of id not found
          res.status(404).json({
            status: `ID: ${id} not found`,
          });
    });
    // catch to catch additional error and tell the client what the error was.
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: `Error: ${err}`,
    });
  }
});

// ! Endpoint that will delete a blog post--------------------------------------------------
// Endpoint that will allow us to delete an entry from our `.json` file. This should be done thru the utilization of the parameter
// use delete to delete a blog post.
// grabbing it by it's id
router.delete("/:id", (req, res) => {
  try {
    // setting id to the request params id
    const id = Number(req.params.id);
    // reading the database
    fs.readFile(dbPath, (err, data) => {
      // if there's an error will throw an error
      if (err) throw err;
      // Parsing the JSON data so we can access it and setting db to it
      const db = JSON.parse(data);
      // filtering all of the data except the match. Looking for everything that doesn't equal the id and grabbing them.
      const filteredDb = db.filter((element) => {
        if (element.post_id !== id) {
          return element;
        }
      });
      // Now will have a filtered db with all of the posts except the one we wanted to delete
      // and we write/save those back into the "database"
      fs.writeFile(dbPath, JSON.stringify(filteredDb), (err) =>
        console.log(err)
      );
      //first we check something was actually deleted. If length is the same it means that id was not found and was not excluded.
      if (filteredDb.length === db.length) {
        return res.status(404).json({
          status: `ID: ${id} not found`,
        });
      }
      // we respond with a status and the new filtered "database" if successfull
      res.status(200).json({
        status: `ID: ${id} successfully deleted`,
        filteredDb,
      });
    });
    // Catch an error if there is an error and return the error to the client.
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: `Error: ${err}`,
    });
  }
});

// export the router
module.exports = router;
