import React, { Component } from "react";
import Chat from "./chat.jsx";
import openSocket from "socket.io-client";
import "../dist/styles.css";
import NavBar from "./NavBar.jsx";
import { withStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import VideoComponent from './VideoComponent.jsx';


class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      // socket: openSocket("http://localhost:3000")
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

  googleOAuth() {
    return 'sign in';

    //⭐️TODO >> want to pass in new component dedicated just for google sign in
  }

  render() {
    return (
      <div>
        <div>
          <NavBar />
        </div>
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