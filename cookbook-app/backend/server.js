const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth"); // authentication routes
const aboutRoutes = require("./routes/about"); // about routes (missing before!)
const recipeRoutes = require("./routes/recipes");

app.use(cors());
app.use(express.json());

app.use("/", authRoutes); // auth: login, register
app.use("/about", aboutRoutes); // now correctly hooking about page
app.use("/home", recipeRoutes); 

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});