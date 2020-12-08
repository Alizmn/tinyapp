const {generateRandomString, userChecker, urlsForUser} = require("./tinyFunc");
const express = require('express');
const app = express();
const PORT = 8080 ;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');


// Password bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// url and user databases
const urlDatabase = {
  "3mWEDz5": {longURL: "http://www.lighthouselabs.ca", userID: "ewvxwf"},
  "2IqViLY": {longURL: "http://www.google.com", userID: "ewvxwf"},
  "2K7qnVG": {longURL: "http://www.bbc.com", userID: "ewvxwf"},
  "chElyQc": {longURL: "http://www.youtube.com", userID: "ewvxwf"},
  "UhElhwP": {longURL: "http://www.Facebook.com", userID: "ewvxwf"},
  "BhElvsP": {longURL: "http://www.instagram.com", userID: "ewvxwf"},
  "uhElQYG": {longURL: "http://www.gmail.com", userID: "ewvxwf"},
  "mhElIES": {longURL: "http://www.costco.ca", userID: "ewvxwf"},
  "fhElFE4": {longURL: "http://www.walmart.ca", userID: "ewvxwf"}
};
const users = { 'b7s52p': { id: 'b7s52p', email: 'c@c.com', password:'$2b$10$fzx9Oj7lZamrteACTy0DputKHy8F9Zh.qawamkGGS5enfo55.ziF.' },
'ewvxwf': { id: 'ewvxwf', email: 'b@b.com', password: '$2b$10$oa98ggui/.odNYfyFsNlHuym2Y1xHJ.7cShRAU3f4tR5OKob40JKy' } };


// logout handelling
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Delete handelling
app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.session["user_id"]) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.send("Invalid / Forbidden Request");
  };
});

// Register form and authentication
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], url: null };
  res.render("register", templateVars);
});
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const {email, password} = req.body;
  if (email && password && !userChecker(users, email)) {
    const hash = bcrypt.hashSync(password, saltRounds);
    users[id] = {id,email,password: hash};
    req.session["user_id"] = id;
    res.redirect("/urls");
  } else {
    res.status(400).send('Bad Request');
  }
});

// login form and authentication
app.post("/login", (req, res) => {
const {email, password} = req.body;
const auth = userChecker(users, email, password);
if (auth) {
  req.session["user_id"] = auth;
  res.redirect("/urls");
} else {
  res.status(403).send('Forbidden');
}
});
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], url: null };
  res.render("login", templateVars);
});

// Edit urls
app.post("/urls/:id", (req, res) => {
  if (req.session["user_id"] === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.send("Invalid / Forbidden Request");
  };
});

// redirect to original site
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session["user_id"]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.send("Invalid / Forbidden Request");
  };
});

//creating new url and add to database
app.get("/urls/new", (req, res) => {
  if (req.session["user_id"]) {
    const templateVars = { user: users[req.session["user_id"]], url: "/urls/new" };
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
  if (urlDatabase[req.params.shortURL].userID === req.session["user_id"]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session["user_id"]],
      url: "/urls"
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("Invalid / forbidden Request");
  };
  
  
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlsForUser(urlDatabase, req.session["user_id"]),
  user: users[req.session["user_id"]],
  url: "/urls"
};
  if (req.session["user_id"]) {
    res.render("urls_index", templateVars);
  } else {
    res.render("loginReq", templateVars);
  };
  
  
});

/*Developing test*/
app.get("/", (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], url: "/urls/new" };
  res.render("home", templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(users);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});