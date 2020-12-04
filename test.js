const userChecker = (users, email) => {
  for (let user in users) {
    // console.log(user);
    console.log(users[user].email);
    // console.log(email);
    if (user.email === email) {
      // console.log("true");
      // return 10;
    } else {
      // console.log("false");
      // return 20;
    }
  };
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
email = "user@example.com";
userChecker(users, email);