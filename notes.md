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