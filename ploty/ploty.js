const express = require('express');
const mongoose = require('mongoose');
const plotly = require('plotly')("saksham4801.be21", "LrIUrpakNYcURCwDsiHL");

const app = express();
const port = 3009;

// Connect to MongoDB
mongoose.connect('mongodb+srv://saksham4801be21:54Z6B1uXtkvfKYhp@cluster0.m9erqgc.mongodb.net/mydb', {useNewUrlParser: true, useUnifiedTopology: true })
.then(() =>{
console.log('connected to MongoDB')
}). catch ((error) => { console. log(error)
})

// Define temperature schema and model
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

// Route to display the chart
app.get('/', async (req, res) => {
  try {
    const data = await Temperature.find({}).sort({ timestamp: 1 });

    const temperatureValues = data.map((entry) => entry.temperature);
    const humidityValues = data.map((entry) => entry.humidity);
    const timestamps = data.map((entry) => entry.timestamp);

    const temperatureTrace = {
      x: timestamps,
      y: temperatureValues,
      mode: 'lines',
      name: 'Temperature'
    };

    const humidityTrace = {
      x: timestamps,
      y: humidityValues,
      mode: 'lines',
      name: 'Humidity'
    };

    const chartData = [temperatureTrace, humidityTrace];
    const layout = {
      title: 'Temperature and Humidity Data',
      xaxis: {
        title: 'Timestamp'
      },
      yaxis: {
        title: 'Value'
      }
    };

    plotly.plot(chartData, layout, function (err, msg) {
      if (err) {
        console.error('Error creating plot:', err);
        return res.status(500).send('Error creating plot');
      }

      const chartUrl = msg.url + '.embed';
      const chartHtml = `<p>Graph below:</p><iframe width="800" height="600" src="${chartUrl}"></iframe>`;
      res.send(chartHtml);
    });
  } catch (err) {
    console.error('Error retrieving data:', err);
    res.status(500).send('Error retrieving data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
