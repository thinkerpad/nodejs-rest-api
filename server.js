const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectToDatabase = require("./data/mongoDb");
const stateRouter = require("./routes/states.routes");
const errorHandler = require("./middlewares/error.middleware");

dotenv.config({ path: ".env" });
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.get(/^\/$|\/index(.html)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/states", stateRouter);

app.all(/(.*)/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectToDatabase();
});
