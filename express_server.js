const {generateRandomString, userChecker, urlsForUser} = require("./tinyFunc");
const express = require('express');
const app = express();
const PORT = 8080 ;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// url and user databases
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "ewvxwf"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "ewvxwf"}
};
const users = { ewvxwf: { id: 'ewvxwf', email: 'a@a.com', password: '1234' } };


// logout handelling
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Delete handelling
app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.cookies["user_id"]) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.send("Invalid / Forbidden Request");
  };
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

// Edit urls
app.post("/urls/:id", (req, res) => {
  if (req.cookies["user_id"] === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.send("Invalid / Forbidden Request");
  };
});

// redirect to original site
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies["user_id"]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.send("Invalid / Forbidden Request");
  };
});

//creating new url and add to database
app.get("/urls/new", (req, res) => {
  if (req.cookies["user_id"]) {
    const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls");
  }
  
  
});
app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});
app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies["user_id"]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("Invalid / forbidden Request");
  };
  
  
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlsForUser(urlDatabase, req.cookies["user_id"]), user: users[req.cookies["user_id"]] };
  if (req.cookies["user_id"]) {
    res.render("urls_index", templateVars);
  } else {
    res.render("loginReq", templateVars);
  };
  
  
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