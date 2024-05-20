// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/staff_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const StaffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  birthday: { type: Date, required: true },
  gender: { type: Number, required: true },
});

const Staff = mongoose.model('Staff', StaffSchema);

// CRUD operations
app.post('/staff', async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).send(staff);
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(409).send('Duplicate staffId');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

app.get('/staff', async (req, res) => {
  const staff = await Staff.find(req.query).maxTimeMS(30000);
  res.send(staff);
});

app.put('/staff/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(staff);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/staff/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.send({ message: 'Staff deleted' });
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
