// ! This is how rob did it and is associated with robblog.json. trying both Paul and Rob's methods.
// ! Variable and router set up ------------------------------------------
// router variable imports the Router Engine from Express
const router = require("express").Router();
// fs needed for functionality
const fs = require("fs");
// the path we will take to access our "database"
const dbPath = "./api/robblog.json";
// uuid for random generation of numbers
const { v4: uuidv4 } = require("uuid");

// ! Endpoint to display all blog posts ---------------------------------
// Create endpoint that will show all posts
// Endpoint that will display all blog posts from the database. In lieu of a database, we use our `blog.json` file.
// use a get for this
router.get("/view-all", (req, res) => {
  // reading the current data
  const currentData = read();
  // will respond with the all the blog posts
  res.json({ posts: currentData });
});

// ! Endpoint to grab one blogpost-----------------------------------
// Endpoint that will display one comment from the database selected by its `post_id`
// Use get to retrieve the blogpost
router.get("/:id", (req, res) => {
  // read the current data
  const currentData = read();
  // filtering the database and looking for a post id that matches the param id. Setting result equal to the filtered data.
  const filteredData = currentData.filter(
    (blog) => blog.post_id == req.params.id
  );
  // if no matches responding no matching posts
  if (filteredData == "") {
    return res.json({ message: "No matching posts found" });
  }
  // if matching post found, show the match
  res.json({ "Matching Post": filteredData });
});

// !Endpoint to create a new blogpost--------------------------------
// Endpoint that will allow us to create a new entry which will be appended to the `.json` file's outermost array.
// using post to create a new post
// Icebox to create unique ID for each entry
router.post("/add", (req, res) => {
  // reading the database
  const currentData = read();
  // creating the constants title, author and body and setting them to the title author and body of the request params
  const { title, author, body } = req.body;
  // pushing the new post to the database
  currentData.push({
    // if you just want counting do this
    // post_id: currentData.length+1,
    // unique id generator that Rob did
    // other key values we need for each entry
    post_id: uuidv4(),
    title: title,
    author: author,
    body: body,
  });
  // writing/saving the new database
  const isSaved = save(currentData);
  // responding with Item Added if added.
  res.json({ message: isSaved ? "Item Added" : "There's a problem" });
});
// !Endpoint to update a blogpost-----------------------------------------
// ! Update item. did this one by params, but the other one using Pauls method with query.
// Use put to update
router.put("/:id", (req, res) => {
  try {
    //  setting constant id to the query id
    const id = req.query.id;
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

// ! Endpoint to delete blog post----------------------------------------
router.delete("/delete/:id", (req, res) => {
  // reading the database
  const currentData = read();
  // filter the data, grabbing onto everything that doesn't match the id.
  const filteredData = currentData.filter(
    (blog) => blog.post_id != req.params.id
  );
  //checking that something was actually deleted. If length is the same it means that id was not found and was not excluded.
  if (filteredData.length === currentData.length) {
    return res.json({
      message: "Could not find the id",
    });
  }
  // otherwise save/write filtered data, respond item deleted. If nothing was respond there's a problem.
  const isSaved = save(filteredData);
  res.json({ message: isSaved ? "Item Deleted" : "There's a problem" });
});

// !Functions to read and write the file --------------------------------
// function that reads file and parses the json data
function read() {
  const file = fs.readFileSync(dbPath);
  return JSON.parse(file);
}
// function that writes/saves data and stringifys it. 
function save(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      return false;
    }
  });
  return true;
}

module.exports = router;
