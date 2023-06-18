const auth = require("../middleware/auth");
 
module.exports = (app) => {
    const stagiaires = require("../controllers/stagiaires.controller.js");
    var router = require("express").Router();
    
    // Create a new stagiaire
    router.post("/", auth, stagiaires.create);
  
    // Retrieve all stagiaire
    router.get("/", auth, stagiaires.findAll);
  
    // Retrieve a single stagiaire with id
    router.get("/:id", auth, stagiaires.findOne);
  
    // Update a stagiaire with id
    router.put("/:id", auth, stagiaires.update);
  
    // Delete a stagiaire with id
    router.delete("/:id", auth, stagiaires.delete);
  
    // Delete all stagiaire
    router.delete("/", auth, stagiaires.deleteAll);
  
    app.use("/api/stagiaires", router);
  };
  