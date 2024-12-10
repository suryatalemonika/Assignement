const axios = require('axios');

let data = {
    Email: 'abc@gmail.com',
    PhoneNumber: '1234567890',
    Password: 'pass@123',
    ConfirmPassword: 'pass@123'
}
axios.post('http://localhost:3000/register', data)
    .then((res) => {
        console.log(`Response : ${JSON.stringify(res.data)}`);
    })
    .catch((error) => {
        console.log(`Error : ${error}`);
    })