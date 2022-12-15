// !TODO THIS COULD CHANGE DEPENDING ON WHAT WE ARE USING FOR A CONTROLLER. SET UP MONDAY PREPARE TO CHANGE.

// router variable imports the Router Engine from Express
const router = require("express").Router();
const db = require("../api/blog.json");
const fs = require("fs");
const { devNull } = require("os");
const dbPath = "./api/blog.json";
// ! ALL POSTS
// Create endpoint that will show all posts
router.get("/", (req, res) => {
  console.log(db);
  try {
    res.status(200).json({
      db,
    });
  } catch (err) {
    res.status(500).json({
      status: `Error: ${err}`,
    });
  }
});

//  create api endpoint
// TODO will have to change what this is
// TODO Also need to check if it's a get or post, etc.
// ! ONE POST BY ID
router.get("/:id", (req, res) => {
  try {
    let { id } = req.params;
    let result = db.filter((i) => i.post_id == id);
    // req = request & res = response
    res.status(200).json({
      status: `Found item at id: ${id}`,
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: `${err}`,
    });
  }
});

// ! Create a new entry.
router.post("/", (req, res) => {
  try {
    const blogItem = req.body;
    // console.log(blogItem)
    fs.readFile(dbPath, (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);
      db.push(blogItem);
      fs.writeFile(dbPath, JSON.stringify(db), () => null);
    });
    res.status(201).json({
      status: "New item created",
      blogItem,
    });
  } catch (err) {
    res.status(500).json({
      error: `${err}`,
    });
  }
});
// ! Update a route
router.patch("/", (req, res) => {
  try {
    const id = req.query.id;
    fs.readFile(dbPath, (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);
      db.forEach((item, index, array) => {
        if (item.post_id == id) {
          array[index] = req.body
        }
      })
      
      fs.writeFile(dbPath, JSON.stringify(db), () => null);
    });
      res.status(201).json({
        status: "item updated",
        updatedPost: req.body
    });
  } catch (err) {
    res.status(500).json({
      error: `${err}`,
    });
  }
});

// ! Delete an item

module.exports = router;
