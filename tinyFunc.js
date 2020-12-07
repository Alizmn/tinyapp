/* 6 characters alphanumeric generator */
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

/* return an object with all data associated with a user */
const urlsForUser= (dataBase, id) => {
  let result = {};
  for (let shortUrl in dataBase) {
    
    if (dataBase[shortUrl].userID === id) {
      result[shortUrl] = dataBase[shortUrl];
    }
  }
  return result;
};

// const urlDatabase = {
//   "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "ewvxwf"},
//   "9sm5xK": {longURL: "http://www.google.com", userID: "ewvxw1"}
// };
// result = urlsForUser(urlDatabase, "ewvxwf");
// result1 = JSON.stringify(result);
// console.log(result);

module.exports = {generateRandomString, userChecker, urlsForUser};