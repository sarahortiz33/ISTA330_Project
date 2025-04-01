const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth"); // make sure path is correct

app.use(cors());
app.use(express.json());

app.use("/", authRoutes); // hook the routes here

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
