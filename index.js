const express = require("express");
const cors = require("cors");
const fs = require("fs");
const uuid = require("uuid");
const app = express();

const usersFile = "./users.json";
const quizzesFile = "./quizzes.json";
const users = require(usersFile);
const quizzes = require(quizzesFile);

app.use(express.json());

// Users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === id);
  res.status(200).json(user);
});

app.get("/users/:id/isAdmin", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === id);
  res.status(200).json(user.isAdmin);
});

app.post("/users", (req, res) => {
  const user = req.body;
  user.id = uuid.v1();
  users.push(user);

  // Today's database is our json files, you can replace lines bellow by requests to your database
  fs.writeFile(usersFile, JSON.stringify(users, null, 2), function writeJSON(err) {
    if (err) console.log(err);
  });

  res.status(200).json(user);
});

app.post("/users/auth", (req, res) => {
  const user = users.find((user) => user.login == req.body.login && user.password == req.body.password);
  if (!!user) {
    res.status(200).json(user);
  } else {
    res.status(404).json("Les identifiants saisis ne permettent pas de vous connecter.");
  }
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.find((user) => user.id === id);
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.login = req.body.login;
  user.password = req.body.password;
  user.isAdmin = req.body.isAdmin;

  // Today's database is our json files, you can replace lines bellow by requests to your database
  users[id] = user;
  fs.writeFile(usersFile, JSON.stringify(users, null, 2), function writeJSON(err) {
    if (err) console.log(err);
  });

  res.status(200).json(user);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.find((user) => user.id === id);
  users.splice(users.indexOf(user), 1);

  // Today's database is our json files, you can replace lines bellow by requests to your database
  fs.writeFile(usersFile, JSON.stringify(users, null, 2), function writeJSON(err) {
    if (err) console.log(err);
  });

  res.status(200).json(users);
});

// Quizzes
app.get("/quizzes", (req, res) => {
  res.status(200).json(quizzes);
});

app.get("/quizzes/:id", (req, res) => {
  const id = req.params.id;
  const quizz = quizzes.find((quizz) => quizz.id === id);
  res.status(200).json(quizz);
});

app.post("/quizzes", (req, res) => {
  const quizz = req.body;
  quizz.id = uuid.v1();
  quizzes.push(quizz);

  // Today's database is our json files, you can replace lines bellow by requests to your database
  fs.writeFile(quizzesFile, JSON.stringify(quizzes, null, 2), function writeJSON(err) {
    if (err) console.log(err);
  });

  res.status(200).json(quizz);
});

app.put("/quizzes/:id", (req, res) => {
  const id = req.params.id;
  let quizz = quizzes.find((quizz) => quizz.id === id);
  quizz.title = req.body.title;
  quizz.description = req.body.description;
  quizz.isRandomQuestions = req.body.isRandomQuestions;
  quizz.duration = req.body.duration;
  quizz.questions = req.body.questions;

  // Today's database is our json files, you can replace lines bellow by requests to your database
  quizzes[id] = quizz;
  fs.writeFile(quizzesFile, JSON.stringify(quizzes, null, 2), function writeJSON(err) {
    if (err) console.log(err);
  });

  res.status(200).json(quizz);
});

app.delete("/quizzes/:id", (req, res) => {
  const id = req.params.id;
  let quizz = quizzes.find((quizz) => quizz.id === id);
  quizzes.splice(quizzes.indexOf(quizz), 1);

  // Today's database is our json files, you can replace lines bellow by requests to your database
  fs.writeFile(quizzesFile, JSON.stringify(quizzes, null, 2), function writeJSON(err) {
    if (err) console.log(err);
  });

  res.status(200).json(quizzes);
});

// Server launch
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.listen(3000, () => {
  console.log("Serveur à l'écoute");
});
