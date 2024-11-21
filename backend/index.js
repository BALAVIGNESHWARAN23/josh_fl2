const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

const app = express();
app.use(cors());
app.use(express.json()); // To parse incoming JSON payloads

// Connect to MongoDB
mongoose.connect('mongodb+srv://Benjon:Ben23@joshfashinventory.hzvcz.mongodb.net/?retryWrites=true&w=majority&appName=JoshFashInventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

// Define a User schema
const userSchema = new mongoose.Schema({
  gmail: { type: String, unique: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
});

// Model for the User schema
const User = mongoose.model('User', userSchema);

// Signup route
app.post('/api/signup', async (req, res) => {
  const { gmail, password, firstname, lastname } = req.body;

  // Check if all required fields are provided
  if (!gmail || !password || !firstname || !lastname) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save a new user
    const newUser = new User({ gmail, password: hashedPassword, firstname, lastname });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { gmail, password } = req.body;

  try {
    // Find the user by email (gmail)
    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the hashed password with the provided password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all registered users (for testing only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set the port for the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});