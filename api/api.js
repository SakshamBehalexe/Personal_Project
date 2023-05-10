const mongoose = require('mongoose');

const Device = require('./models/device'); 

const bodyParser = require('body-parser');

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

mongoose.connect('mongodb+srv://saksham4801be21:54Z6B1uXtkvfKYhp@cluster0.m9erqgc.mongodb.net/mydb', {useNewUrlParser: true, useUnifiedTopology: true })
.then(() =>{
console.log('connected to MongoDB')
}). catch ((error) => { console. log(error)
})

const express = require('express');

const app = express();
const port = 5003;
const cors = require('cors');

app.use(express.static(`${__dirname}/public/generated-docs`));

app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

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
/**
 * @api {get} /api/test TestAPI Check if the API is working
 * @apiGroup Device
 * @apiSuccessExample {text} Success-Response:
 *   The API is working!
 */
app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});

/**
 * @api {get} /devices AllDevices
 * @apiGroup Device
 * @apiSuccessExample {json} Success-Response:
 *  [
 *    {
 *      "_id": "dsohsdohsdofhsofhosfhsofh",
 *      "name": "Mary's iPhone",
 *      "user": "mary",
 *      "sensorData": [
 *        {
 *          "ts": "1529542230",
 *          "temp": 12,
 *          "loc": {
 *            "lat": -37.84674,
 *            "lon": 145.115113
 *          }
 *        }
 *      ],
 *     "role": "light"
 *    }
 *  ]
 * @apiErrorExample {json} Error-Response:
 *  {
 *    "User does not exist"
 *  }
 */
app.get('/devices', (req, res) => {
  Device.find({})
    .then(devices => {
      res.send(devices);
    })
    .catch(error => {
      res.send(error);
    });
});

/**
* @api {post} /devices AddDevice Add a new device
* @apiGroup Device
* @apiParam {String} name Name of the device
* @apiParam {String} user User of the device
* @apiParam {Object[]} sensorData Sensor data array
* @apiParam {String} role Role of the device
* @apiSuccessExample {text} Success-Response:
*   successfully added device and data
*/
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

/**
* @api {get} /devices/:id GetDevice Get a device by ID
* @apiGroup Device
* @apiParam {String} id ID of the device
* @apiSuccessExample {json} Success-Response:
*   {
*     "_id": "dsohsdohsdofhsofhosfhsofh",
*     "name": "Mary's iPhone",
*     "user": "mary",
*     "sensorData": [
*       {
*         "ts": "1529542230",
*         "temp": 12,
*         "loc": {
*           "lat": -37.84674,
*           "lon": 145.115113
*         }
*       },
*       {
*         "ts": "1529572230",
*         "temp": 17,
*         "loc": {
*           "lat": -37.850026,
*           "lon": 145.117683
*         }
*       }
*     ],
*     "role": "light"
*   }
* @apiErrorExample {text} Error-Response:
*   Device not found
*/
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

/**
* @api {delete} /devices/:id DeleteDevice Delete a device by ID
* @apiGroup Device
* @apiParam {String} id ID of the device
* @apiSuccessExample {text} Success-Response:
*   No content
* @apiErrorExample {json} Error-Response:
*   {
*     "error": "Error deleting device"
*   }
*/
app.delete('/devices/:id', async (req, res) => {
 try {
   const deviceId = req.params.id;
   await Device.findByIdAndRemove(deviceId);
   res.sendStatus(204); // No content
 } catch (error) {
   res.status(500).json({ error: 'Error deleting device' });
 }
});

// API endpoint to get all temperature data
app.get('/temperatures', async (req, res) => {
  try {
    const data = await Temperature.find({});
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
