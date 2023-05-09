const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

const base = `${__dirname}/public`;

const cors = require('cors');

app.use(express.static('public'));

// Middleware for parsing JSON in request body
app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Allow DELETE method
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'DELETE');
  next();
});

app.get('/', function(req, res) {
    res.sendFile(`${base}/welcome.html`);
});

app.get('/light', function(req, res) 
{
    res.sendFile(`${base}/light.html`);
});

app.get('/security', function(req, res) 
{
    res.sendFile(`${base}/security.html`);
});

app.get('/ac', function(req, res) {
    res.sendFile(`${base}/ac.html`);
});

// Route to device list page
app.get('/device-list', function(req, res) {
    res.sendFile(`${base}/device-list.html`);
});

// Route to register device page
app.get('/register-device', function(req, res) {
    res.sendFile(`${base}/register-device.html`);
});

// Route to IoT applications page
app.get('/delete-device', function(req, res) {
    res.sendFile(`${base}/delete-device.html`);
});
// Handle all other routes with a 404 page
app.get('*', function(req, res) {
    res.sendFile(`${base}/404.html`);
});



// Handle POST requests to /set-ac
app.post('/set-ac', (req, res) => {
    const { temperature, mode, fanSpeed } = req.body;
  
    // Do something with the temperature, mode, and fanSpeed values
    // (e.g. update the AC system, store them in a database, etc.)
  
    // Create an array of the selected items
    const selectedItems = [temperature, mode, fanSpeed];
  
    // Log the selected items to the console in an array form
    console.log(selectedItems);
  
    // Send a response back to the client
    res.json({ message: 'AC settings updated successfully' });
  });
  

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
