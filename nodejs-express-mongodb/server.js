const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

// Apply the auth middleware only to routes that require authentication
const auth = require("./middleware/auth");

// Routes
const userRoutes = require("./routes/users.route");
app.use("/users", userRoutes); // Apply the userRoutes middleware to all /users routes
require("./routes/stagiaires.route")(app);
require("./routes/groupes.route")(app);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
