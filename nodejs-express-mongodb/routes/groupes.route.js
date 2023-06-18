module.exports = (app) => {
  const groupes = require("../controllers/groupes.controller.js");
  var router = require("express").Router();
  // Create a new stagiaire
 router.post("/", groupes.create);

// Retrieve all groupes
router.get("/", groupes.findAll);

// Retrieve a single groupe with id
router.get("/:id", groupes.findOne);

// Update a groupe with id
router.put("/:id", groupes.update);

// Delete a groupe with id
router.delete("/:id", groupes.delete);

// Delete all groupes
router.delete("/", groupes.deleteAll);

  app.use("/api/groupes", router);
  };
