const db = require("../models");
const Groupe = db.groupes;

// Create and Save a new Groupe
exports.create = (req, res) => {
  if (!req.body.nom) {
    res.status(400).send({ message: "Le nom du groupe ne peut pas être vide." });
    return;
  }

  const groupe = new Groupe({
    nom: req.body.nom,
    description: req.body.description,
  });

  groupe
    .save(groupe)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la création du groupe.",
      });
    });
};

// Retrieve all Groupes from the database.
exports.findAll = (req, res) => {
  console.log('In findAll function');
  Groupe.find()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur est survenue lors de la récupération des groupes.",
      });
    });
};

// Find a single Groupe with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Groupe.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Aucun groupe trouvé avec l'id " + id,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la récupération du groupe avec l'id " + id,
      });
    });
};

// Update a Groupe by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les données à mettre à jour ne peuvent pas être vides.",
    });
  }

  const id = req.params.id;

  Groupe.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour le groupe avec l'id ${id}. Le groupe est introuvable.`,
        });
      } else res.send({ message: "Le groupe a été mis à jour avec succès." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour du groupe avec l'id " + id,
      });
    });
};

// Delete a Groupe with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Groupe.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer le groupe avec l'id ${id}. Le groupe est introuvable.`,
        });
      } else {
        res.send({
          message: "Le groupe a été supprimé avec succès !",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Impossible de supprimer le groupe avec l'id=" + id,
      });
    });
};

// Delete all Groupes
exports.deleteAll = (req, res) => {
  Groupe.deleteMany({})
  .then(data => {
    res.send({
      message: `${data.deletedCount} Groupes were deleted successfully!`
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all groupes."
    });
  });
};