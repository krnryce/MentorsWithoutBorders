import React, { Component } from "react";
import Chat from "./chat.jsx";
import openSocket from "socket.io-client";
import "../dist/styles.css";
import NavBar from "./NavBar.jsx";
import Login from "./Login.jsx"
// import config from "../../config.js";

import VideoComponent from './VideoComponent.jsx';


class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      socket: openSocket("http://localhost:3000"),
      isUserOn: false,
      isAuthenticated: false,
      user: null,
      token: ''
    };

    this.state.socket.on("get message", data => {
      this.setState({
        messages: data
      });
    });
  }

  handleLinkClick() {
    this.refs.dropdown.hide();
  }

  googleResponse(response) {
    console.log('works?');
    console.log(response);
  }

  onFailure(response){
    console.log('not working');
  }


  googleOAuth() {
    if(!this.state.isAuthenticated) {
      console.log('true');
      return (
        <Login />
      )
    }
    //⭐️TODO >> want to pass in new component dedicated just for google sign in
  }

  render() {
    return (
      <div>
        <div>
          <NavBar />
        </div>
        {this.googleOAuth()}
        <div>
          <VideoComponent />
        </div>
        <div>
          <Chat messages={this.state.messages} socket={this.state.socket} />
        </div>
      </div>
    );
  }
}

export default App;