const db = require("../models");
const Stagiaire = db.stagiaires;
// Create and Save a new Tutorial
exports.create = (req, res) => {
if (!req.body.nom || !req.body.prenom) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
  }
             const stagiaire = new Stagiaire({
               nom: req.body.nom,
               prenom: req.body.prenom,
               address: req.body.address,
             });
            // Save stag in the database
            stagiaire
            .save(stagiaire)
            .then(data => {
            res.send(data);    
            })
            .catch(err => {
            res.status(500).send({
            message:
            err.message || "Some error occurred while creating the stagiaire"
            });
        
 });
};



// Retrieve all Tutorials from the database.

exports.findAll =(req,res)=>{
Stagiaire.find()
  .then((data) => {
    console.log(data);

    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving ",
    });
  });
}
   
// Find a single Stagiaire with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Stagiaire.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Stagiaire with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Stagiaire with id=" + id });
    
    });
  
};

 
// Update a Stagiaire by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Stagiaire.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Stagiaire with id=${id}. Maybe Stagiaire was not found!`
        });
      } else res.send({ message: "Stagiaire was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Stagiaire with id=" + id
      });
    });
};
// Delete a Stagiaire with the specified id in the request
exports.delete = (req, res) => {
 const id = req.params.id;
 Stagiaire.findByIdAndRemove(id)
 .then(data => {
 if (!data) {
 res.status(404).send({
    message: "Cannot delete stagiaire with id=${id}."
    });
    } else {
    res.send({
    message: "stagiaire was deleted successfully!"
    });
    }
    })
    .catch(err => {
    res.status(500).send({
    message: "Could not delete Tutorial with id=" + id
 });
 });
};
// Delete all Stagiaires
exports.deleteAll = (req, res) => {
  Stagiaire.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Stagiaires were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all stagiaires."
      });
    });
};


