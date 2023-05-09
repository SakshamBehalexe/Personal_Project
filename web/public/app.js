$('#navbar').load('navbar.html');
const API_URL = 'http://localhost:5003';


$.get(`${API_URL}/devices`, function(devices) {
    devices.forEach(function(device) {
        $('#devices tbody').append(`
        <tr>
        <td>${device.user}</td>
        <td>${device.name}</td>
        <td>
        <button class="btn btn-primary btn-sm more-info" data-user="${device.user}" data-name="${device.name}">More Info</button>
        <button class="btn btn-danger btn-sm delete-device" data-user="${device.user}" data-name="${device.name}">Delete</button>
        </td>
        </tr>
    `);
  });
});

$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const role = $('#role').val();
    const sensorData = [];
  
    const body = {
      name,
      user,
      sensorData,
      role
    };
  
    $.post(`${API_URL}/devices`, body)
    .then(response => {
      location.href = '/';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
  });

  $(document).ready(() => {
    // Delete device button click handler
    $('#devices').on('click', '.delete-device', () => {
        const id = $(this).data('_id');
        
        $.ajax({
            url: `${API_URL}/devices/${id}`,
            method: 'DELETE',
            success: (result) => {
                // Remove device from table
                $(`#devices tbody tr[data-_id="${id}"]`).remove();
            },
            error: (xhr, status, error) => {
                console.error(`Error deleting device: ${error}`);
            }
        });
    });
});



$('#devices').on('click', '.more-info', function() {
    const id = $(this).data('id');
    
    // Find the device with the given id in the devices array
    const device = devices.find(d => d._id === id);
    
    // Check the device role and redirect to the appropriate page
    switch (device.role) {
      case 'AC':
        location.href = '/ac';
        break;
      case 'Security':
        location.href = '/security';
        break;
      case 'Light':
        location.href = '/light';
        break;
      default:
        console.error(`Error: Unknown device role "${device.role}"`);
    }
  });
  