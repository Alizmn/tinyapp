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
/*
Password is optional
with password: return user_id if email and password match else return false
without password: return true if email exict else false
*/
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
// url and user databases
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {};


// logout handelling
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Delete handelling
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

// redirect to original site
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//creating new url and add to database
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
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

/*Developing test*/
app.get("/", (req, res) => {
  res.redirect("/urls");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});