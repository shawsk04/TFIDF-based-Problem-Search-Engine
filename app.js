const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path")
const {getProblemList} = require("./helpers/getProblemList")


// setting up app
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is running on port " + port);
}); 

//GET request to home page
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/search", (req, res) => {
  const query = req.body.question;
  const question = query.toLowerCase();
  const arr = getProblemList(question);
  console.log(arr);

  res.render("searchResult",{resp: arr});

});