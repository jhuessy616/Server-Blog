const router = require("express").Router();
const fs = require("fs");
const dbPath = "./api/robblog.json";
const { v4: uuidv4 } = require('uuid');
 
// ! Get all items
router.get("/view-all", (req, res) => {
    const currentData = read();
    res.json({ posts: currentData });
}); 

// ! Get one item
router.get("/:id", (req, res) => {
    const currentData = read();
    const filteredData = currentData.filter((blog) => blog.post_id == req.params.id);
     if (filteredData == "") {
        return res.json({message: "No matching posts found"});
    }
    res.json({ "Matching Post": filteredData });
   
}); 


// !Add item 
router.post("/add", (req, res) => {
    const currentData = read()
    const { title, author, body }
        = req.body;
    currentData.push({
        post_id: uuidv4(),
        title: title,
        author: author,
        body: body,
    });
    const isSaved = save(currentData);
    res.json({ message: isSaved ? "Item Added" : "There's a problem" });
});
// Todo
// ! Update item 

// ! Delete
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