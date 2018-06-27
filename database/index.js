//currently mongoose will refactor l8r to a diff database like postgresql
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/global-mentors');
//mongodb uri is located in config.js file, it's connected to mlab, do l8r cuz only takes 500mb of data

var db = mongoose.connection;
db.on('error', () => console.log('AWWWW, DATABASE IS NOT CONNECTED :('));
db.once('open', () => console.log('🌸 Database connected🌸 '));

//importing all schemas
var schemas = require('./schemas.js');

//⭐️ write funcs here⭐️
//todo >> write func that saves user to db after google oauth