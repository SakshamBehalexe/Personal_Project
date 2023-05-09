const axios = require('axios');
API_URL="http://localhost:5003"

test('get all devices', () => {
    return axios.get(`${API_URL}/devices`)
      .then(resp => resp.data)
      .then(devices => {
        expect(devices.length).toBeGreaterThan(0);
      });
  });
  
  test('create a new device', () => {
    const newDevice = {
      name: 'Device 1',
      user: 'User 1',
      sensorData: [],
      role: 'Role 1'
    };
  
    return axios.post(`${API_URL}/devices`, newDevice)
      .then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data).toEqual('successfully added device and data');
      });
  });

  test('retrieve a device by ID', () => {
    const deviceId = '12345'; // Replace with a valid device ID
  
    return axios.get(`${API_URL}/devices/${deviceId}`)
      .then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data).toBeDefined(); // Device data should be defined
      });
  });


  