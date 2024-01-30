import axios from "axios";
const url = "http://localhost:3001/";

export class ApiClient {
  // the constructor function takes in two callback functions which change the state in the page.js.
  // the page.js is where the state is stored so the functions we callback have to be there.
  constructor(tokenProvider, logoutHandler) {
    this.tokenProvider = tokenProvider;
    this.logoutHandler = logoutHandler;
  }

  async authenticatedCall(method, url, data) {
    return await axios({
      method,
      url,
      headers: {
        // returns the token which we then check on the backend to see if there is a user
        // in the db that has that token
        authorization: this.tokenProvider(),
      },
      data,
    }).catch((error) => {
      console.log(error)
      if (error.response.status === 403) {// 403 indicates that the user is not logged in 
        // therefore we call the logouthandler function and clear the local storage and the state
        this.logoutHandler();
        return Promise.reject();
      } else {
        throw error;
      }
    });
  }

  async getEvents() {
    console.log("Get events - call api")
    return await this.authenticatedCall("get", url);
  }

  addEvent(name, city, date, price, description) {
    console.log("addEvent Api Client called")
    return this.authenticatedCall("post", url, { name, city, date, price, description });
  }

  addAd(name, price) {
    console.log("addAd Api Client called")
    return this.authenticatedCall("post", url, { name, price });
  }

  removeEvent(id) {
    return this.authenticatedCall("delete", `${url}${id}`);
  }

  updateEvent(id, name, city, date, price, description) {
    console.log(`Calling Update: ${id}`)
    return this.authenticatedCall("put", `${url}${id}`, { name, city, date, price, description });
  }

  async login(username, password) {
    return await axios({
      method: "post",
      url: `${url}auth`,
      data: { username, password },
    });
  }
}

// name: String,
// city: String,
// date: Number,
// price: Number,
// description: String