const axios = require('axios');

let data = {
    Email: 'abc@gmail.com',
    Password: 'pass@123'
}
axios.get('http://localhost:3000/login', {
    data: {
        Email: 'abc@gmail.com',
        Password: 'pass@123'
    }
})
    .then((res) => {
        console.log(`Response : ${JSON.stringify(res.data)}`);
    })
    .catch((error) => {
        console.log(`Error : ${error}`);
    })