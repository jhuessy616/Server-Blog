// router variable imports the Router Engine from Express
const router = require("express").Router();
const db = require("../api/blog.json");
const fs = require("fs");
const { devNull } = require("os");
const dbPath = "./api/blog.json";
// ! ALL POSTS
// Create endpoint that will show all posts
router.get("/", (req, res) => {
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

// ! ONE POST BY ID
router.get("/:id", (req, res) => {
  try {
    let { id } = req.params;
    let result = db.filter((i) => i.post_id == id);
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
// ! Update a route using query to grab. Directions say grab from query
router.put("/", (req, res) => {
  try {
    const id = req.query.id;
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

// ! Delete an item

router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    fs.readFile(dbPath, (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);
      const filteredDb = db.filter((element) => {
        if (element.post_id !== id) {
          return element;
        }
      });

      fs.writeFile(dbPath, JSON.stringify(filteredDb), (err) =>
        console.log(err)
      );

      res.status(200).json({
        status: `ID: ${id} successfully deleted`,
        filteredDb,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: `Error: ${err}`,
    });
  }
});

module.exports = router;
