const express = require('express');
const { dbConnect } = require('./DbOperations/dbconnect');
const { userModel } = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;
const secretKey = 'userDetails';
app.use(express.json());

const verifyRole = (role) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ msg: 'No token provided' });

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return res.status(401).json({ msg: 'Token invalid', error: err });
            if (decoded.role !== role) return res.status(403).json({ msg: 'Operation not permitted' });

            req.user = decoded;
            next();
        });
    };
};

app.post('/login', async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await userModel.findOne({ Email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
        res.json({ message: 'Logged In Successfully', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { Email, PhoneNumber, Password, ConfirmPassword, role = 'user' } = req.body;

    if (Password !== ConfirmPassword) return res.status(400).json({ msg: 'Passwords do not match' });

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new userModel({ Email, PhoneNumber, Password: hashedPassword, role });

        const savedUser = await newUser.save();
        res.json({ msg: 'User registration successful', data: savedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user', verifyRole('admin'), async (req, res) => {
    try {
        const users = await userModel.find();
        res.json({ msg: 'All users retrieved', data: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user/:Email', verifyRole('admin'), async (req, res) => {
    try {
        const user = await userModel.findOne({ Email: req.params.Email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({ msg: 'User retrieved', data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/user/:Email', verifyRole('admin'), async (req, res) => {
    try {
        const updatedUser = await userModel.findOneAndUpdate(
            { Email: req.params.Email },
            req.body,
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ msg: 'User not found' });

        res.json({ msg: 'User updated', data: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/user/:Email', verifyRole('admin'), async (req, res) => {
    try {
        const deletedUser = await userModel.findOneAndDelete({ Email: req.params.Email });
        if (!deletedUser) return res.status(404).json({ msg: 'User not found' });

        res.json({ msg: 'User deleted', data: deletedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/user', verifyRole('admin'), async (req, res) => {
    const { Email, PhoneNumber, Password, ConfirmPassword, role = 'user' } = req.body;

    if (Password !== ConfirmPassword) return res.status(400).json({ msg: 'Passwords do not match' });

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new userModel({ Email, PhoneNumber, Password: hashedPassword, role });

        const savedUser = await newUser.save();
        res.json({ msg: 'User added', data: savedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
