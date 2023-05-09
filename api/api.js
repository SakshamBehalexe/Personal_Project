const mongoose = require('mongoose');

const Device = require('./models/device'); 

const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://saksham4801be21:54Z6B1uXtkvfKYhp@cluster0.m9erqgc.mongodb.net/mydb', {useNewUrlParser: true, useUnifiedTopology: true })
.then(() =>{
console.log('connected to MongoDB')
}). catch ((error) => { console. log(error)
})

const express = require('express');

const app = express();
const port = 5003;
const cors = require('cors');

app.use(cors());

// Allow DELETE method
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'DELETE');
  next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});

app.get('/devices', (req, res) => {
  Device.find({})
    .then(devices => {
      res.send(devices);
    })
    .catch(error => {
      res.send(error);
    });
});

app.post('/devices', (req, res) => {
    const { name, user, sensorData, role } = req.body;
    const newDevice = new Device({
      name,
      user,
      sensorData,
      role
    });
    newDevice.save()
      .then(() => res.send('successfully added device and data'))
      .catch(err => res.send(err));
  });

  app.get('/devices/:id', (req, res) => {
    const id = req.params.id;
    Device.findOne({ _id: id })
      .then(device => {
        if (!device) {
          return res.status(404).send('Device not found');
        }
        res.send(device);
      })
      .catch(error => {
        res.send(error);
      });
  });
  

  app.delete('/devices/:id', async (req, res) => {
    try {
        const deviceId = req.params.id;
        
        await Device.findByIdAndRemove(deviceId);
        
        res.sendStatus(204); // No content
    } catch (error) {
        res.status(500).json({ error: 'Error deleting device' });
    }
});

  
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
