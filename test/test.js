const { dbConnect } = require('../DbOperations/dbconnect')
const { userModel } = require('../models/User')


const getusers = async () => {
    let user = await userModel.find();
    console.log(user);
}

getusers()