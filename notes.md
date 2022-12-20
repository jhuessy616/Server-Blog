First attempt patch


// postToEdit = db.filter((i) => i.post_id == id)[0];
      
      // console.log(req.body);
      // const keys = Object.keys(req.body);
      // console.log(keys);
      // for (i of keys) {
      //   postToEdit[i] = req.body[i];
      // }
      // db.push(postToEdit);


      <!-- ! How Jonas aALice and i did an update, different than pauls --> 
      // ! Update a route
router.put("/:id", (req, res) => {
  try {
    const id = req.query.id;
    fs.readFile(dbPath, (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);
      db.forEach((item, index, array) => {
        if (item.post_id == id) {
          array[index] = req.body;
        }
      });

      fs.writeFile(dbPath, JSON.stringify(db), () => null);
    });
    res.status(201).json({
      status: "item updated",
      updatedPost: req.body,
    });
  } catch (err) {
    res.status(500).json({
      error: `${err}`,
    });
  }
});
<!-- Trying Rob's method for update -->
 router.put("/update/:id", (req, res) => {
    const blogPost = req.body
    const id = Number(req.params.id)
    let result;
    const currentData = read();
    currentData.forEach((element, index) => {
        if (element.post_id === id) {
            currentData[index] = blogPost;
            result = blogPost;
            const isSaved = save(currentData);
            res.json({ message: isSaved ? "Item Updated" : "There's a problem" });
        }
    });
});


Paul's way update
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

<!-- strange thing i had  -->
const { devNull } = require("os");