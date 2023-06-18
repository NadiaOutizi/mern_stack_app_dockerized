module.exports = (mongoose) => {
    const schema = mongoose.Schema(
      {
        nom: String,
        description: String,
        stagiaire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'stagiaires' }]
      },
      { timestamps: true }
    );
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Groupe = mongoose.model("groupes", schema);
    return Groupe;
  };
  