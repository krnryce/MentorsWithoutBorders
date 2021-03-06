import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from 'axios';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import VideoChatRoom from './VideoChatRoom';
import MentorSearch from './MentorSearchComponents/MentorSearch';
import MentorHome from './MentorHome';
import MenteeHome from './MenteeHome/MenteeHome';
import Nav from './Nav';
import Login from './Login';
import Chat from './Chat';
import Home from './Home';
import MentorSignUp from './MenteeHome/MentorSignUp';
import '../dist/styles.css';
import PersonalityAnalysis from './PersonalityAnalysis';
import AnalyzeScore from './AnalyzeScore';

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      isUserOn: false,
      name: '',
      userId: '',
      isMentor: '',
      videoChat: false,
      roomName: '',
      socketId: '',
      socketName: '',
      mailCount: [],
    };
    this.socket = io();
    this.setIsUserOn = this.setIsUserOn.bind(this);
    this.changeMentorStatus = this.changeMentorStatus.bind(this);
    this.socket.on('request', (data) => {
      console.log('request', data);
      this.getRequests();
    });

    this.socket.on('enterVideoChat', (data) => {
      console.log('entervideochat', data);
      this.setState({
        videoChat: true,
        roomName: data.roomName,
        socketId: data.toSocket,
        socketName: data.name,
      });
    });
  }

  componentDidMount() {
    this.getRequests();
  }

  setIsUserOn(info) {
    this.setState({
      isUserOn: true,
      name: info.dbInfo.fullName,
      photo: info.dbInfo.photo,
      userId: info.dbInfo.id,
      isMentor: info.dbInfo.isMentor,
    });
    this.socket.emit('userLoggedIn', {
      userId: info.dbInfo.id,
      name: info.dbInfo.fullName,
      photo: info.dbInfo.photo,
    });
  }

  changeMentorStatus() {
    this.setState({ isMentor: true });
  }

  getRequests() {
    axios.get('/requests')
      .then(({ data }) => {
        console.log('request data', data);
        this.setState(previousState => ({
          mailCount: [...previousState.mailCount, data],
        }));
      });
  }

  render() {
    const {
      isUserOn, messages, userId, name, videoChat, isMentor, mailCount,
    } = this.state;

    return (

      <div className="nav">
        <Nav name={name} isUserOn={isUserOn} mailCount={mailCount} socket={this.socket} userId={userId} />

        <Route exact path="/" component={Home} />
        <Route path="/mentor" component={() => <MentorHome userId={userId} />} />
        <Route path="/mentee" component={() => <MenteeHome isUserOn={isUserOn} userId={userId} isMentor={isMentor} socket={this.socket} />} />
        <Route path="/chat" component={() => <VideoChatRoom {...this.state} socket={this.socket} />} />
        <Route path="/searchResults" component={MentorSearch} />
        <Route path="/personality-analysis" component={() => <PersonalityAnalysis userId={userId} />} />
        <Route path="/mentor-sign-up" component={() => <MentorSignUp isMentor={isMentor} userId={userId} changeMentorStatus={this.changeMentorStatus} />} />
        <div className="main">
          {videoChat && (
            <Button
              component={Link}
              to="/chat"
            >
              HEREEEE
            </Button>
          )}
          <div className="main">
            {!isUserOn && <Login setIsUserOn={this.setIsUserOn} />}
          </div>
        </div>
      </div>
    );
  }
}

const AppWithRouter = withRouter(App);
export default AppWithRouter;
