const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const exampleData = require("./exampleData").exampleMessages; //temp stuff
const bodyParser = require("body-parser");

const app = express();
const server = http.Server(app);
const io = socketIo(server);

//------------video stuffs------------//=

require("dotenv").config();
var path = require("path");
var faker = require("faker");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

app.get("/token", function (request, response) {
  var identity = faker.name.findName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token
  token.identity = identity;

  const grant = new VideoGrant();
  // Grant token access to the Video API features
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

//------------video stuffs end------------//=



//⬇⬇⬇ for google oauth ⬇⬇⬇
const passport = require("passport"),
  auth = require("./auth"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session");
auth(passport);
app.use(passport.initialize());
app.use(cookieSession({ name: "session", keys: ["123"] }));
app.use(cookieParser());
//⬆⬆⬆ end ⬆⬆⬆

const port = process.env.PORT || 3000;
const data = require("../database");

io.on("connection", socket => {
  socket.emit("get message", exampleData);
  socket.on("new message", message => {
    exampleData.push({
      name: "Kav",
      message: message
    });

    socket.broadcast.emit("get message", exampleData);
  });
});

app.use(express.static(__dirname + "/../client/dist"));

//------------google oauth------------//=
app.get("/", (req, res) => {
  if (req.session.token) {
    res.cookie("token", req.session.token);
    res.json({ status: "session cookie set" });
    console.log("user logged in!");
  } else {
    res.cookie("token", "");
    res.json({ status: "session cookie not set" });
    console.log("user not yet logged in");
  }
});

//redirects client to google login page
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile"]
  })
);

//when user successfully logs in
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }), //back 2 home
  (req, res) => {
    req.session.token = req.user.token; //set cookies
    res.redirect("/"); //back to homepage
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.redirect("/");
});
//------------google oauth end------------//

server.listen(port, function() {
  console.log(`Listening on port: ${port}`);
});
