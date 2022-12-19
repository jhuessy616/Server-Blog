// ! This is how rob did it and is associated with robblog.json. trying both Paul and Rob's methods

const router = require("express").Router();
const fs = require("fs");
const dbPath = "./api/robblog.json";
const { v4: uuidv4 } = require('uuid');
 
// ! Endpoint to display all blog posts ---------------------------------
router.get("/view-all", (req, res) => {
    const currentData = read();
    res.json({ posts: currentData });
}); 

// ! Endpoint to grab one blogpost-----------------------------------
router.get("/:id", (req, res) => {
    const currentData = read();
    const filteredData = currentData.filter((blog) => blog.post_id == req.params.id);
     if (filteredData == "") {
        return res.json({message: "No matching posts found"});
    }
    res.json({ "Matching Post": filteredData });
   
}); 


// !Endpoint to create a new blogpost--------------------------------
// Icebox to create unique ID for each entry
router.post("/add", (req, res) => {
    const currentData = read()
    const { title, author, body }
        = req.body;
    currentData.push({
        // if you just want counting do this
        // post_id: currentData.length+1,
        // unique id generatorthat Rob did
        post_id: uuidv4(),
        title: title,
        author: author,
        body: body,
    });
    const isSaved = save(currentData);
    res.json({ message: isSaved ? "Item Added" : "There's a problem" });
});
// !Endpoint to update a blogpost-----------------------------------------
// ! Update item. did this one by params, but the other one using Pauls method with query. 
router.put("/:id", (req, res) => {
  try {
    const id =(req.params.id);
    const blogPost= req.body
    let result;
    fs.readFile(dbPath, (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);
   db.forEach((element, index) => {
        if (element.post_id == id) {
          db[index] = blogPost;
          result = blogPost;
          fs.writeFile(dbPath, JSON.stringify(db), (err) => console.log(err));
        }
      });

      result
        ? res.status(200).json({
            status: `ID: ${id} succesfully modified`,
            object: result,
          })
        : res.status(404).json({
            status: `ID: ${id} not found`,
          });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: `Error: ${err}`,
    });
  }
});

// ! Endpoint to delete blog post----------------------------------------
router.delete("/delete/:id", (req, res) => {
    const currentData = read();
    const filteredData = currentData.filter((blog) => blog.post_id != req.params.id);
    if (filteredData.length === currentData.length) {
        return res.json({
            message: "Could not find the id",
        });
    }
   const isSaved = save(filteredData);
    res.json({ message: isSaved ? "Item Deleted" : "There's a problem" });
}); 




// !Functions to read and write the file --------------------------------

function read() {
    const file = fs.readFileSync(dbPath);
    return JSON.parse(file);
}
function save(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
            return false;
        }
    });
    return true
}

module.exports = router;