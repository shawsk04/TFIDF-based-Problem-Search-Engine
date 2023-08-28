const express = require("express");
const ejs = require("ejs");
const path = require("path")

const {getProblemList, readFileAsArr} = require("./helpers/getProblemList")

const problem_titles = readFileAsArr('./database/problem_titles.txt');
const problem_urls = readFileAsArr('./database/problem_urls.txt');


// setting up app
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("./public"));

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

  if(arr.length == 0) res.render("unavailable");
  else res.render("searchResult",{resp: arr});

});

app.get("/question/:doc_no", (req, res) => {

  const doc_no = req.params.doc_no;
  const idx = doc_no - 1;
  const probStatement = readFileAsArr("./database/problems/problem_text_"+ (idx + 1) +".txt");

  res.render("questionDescription", {
      title: problem_titles[idx],
      url: problem_urls[idx],
      statement: probStatement
  });
});