const mongoose = require('mongoose');
const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb+srv://saksham4801be21:54Z6B1uXtkvfKYhp@cluster0.m9erqgc.mongodb.net/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log(error);
});

const cors = require('cors');
app.use(cors());

// Allow DELETE method
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'DELETE');
  next();
});

const port = 5008;

const mqttLink = "http://localhost:5008"

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const temperatureSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

client.on('connect', () => {
  client.subscribe('User_Device', (err) => {
    if (err) {
      console.log(err);
    }
  });
});

const { v4: uuidv4 } = require('uuid');

client.on('message', async (topic, message) => {
  if (topic === 'User_Device') {
    try {
      const data = JSON.parse(message.toString());
      console.log('Message received:', data);

      // Generate a random sensor ID
      const sensorId = uuidv4();

      // Save the temperature data to MongoDB
      const temperatureData = new Temperature({
        sensorId: sensorId,
        temperature: data.temperature,
        humidity: data.humidity
      });
      await temperatureData.save();

      console.log('Temperature data saved to MongoDB');
    } catch (error) {
      console.log(error);
    }
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}, link to the MQTT server: ${mqttLink}`);
});
