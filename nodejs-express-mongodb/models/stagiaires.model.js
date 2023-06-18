module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      nom: String,
      prenom: String,
      address: String,
      userId : {
        type :mongoose. Schema. Types. ObjectId,
        ref: "User",
        required: true
    }
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Stagiaire = mongoose.model("stagiaire", schema);
  return Stagiaire;
};
