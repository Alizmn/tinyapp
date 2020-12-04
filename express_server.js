const express = require('express');
const app = express();
const PORT = 8080 ;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

const userChecker = (users, email, password) => {
  for (let user in users) {
    if (users[user].email === email && password) {
      if (users[user].password === password) {
        return user;
      } else {
        return false;
      }
    } else if (users[user].email === email) {
      return true;
    } else {
      return false;
    }
  };
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {};



// app.post("/login", (req, res) => {
//   res.cookie('username', req.body.username);
//   res.redirect("/urls");
// });

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// Register form and authentication
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("register", templateVars);
});
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const {email, password} = req.body;
  if (email && password && !userChecker(users, email)) {
    users[id] = {id,email,password};
    res.cookie("user_id", id);
    res.redirect("/urls");
  } else {
    res.status(400).send('Bad Request');
  }
  console.log(users);
});

// login form and authentication
app.post("/login", (req, res) => {
console.log(req.body);
const {email, password} = req.body;
const auth = userChecker(users, email, password)
if (auth) {
  res.cookie("user_id", auth);
  res.redirect("/urls");
} else {
  res.status(403).send('Forbidden');
}
});
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});