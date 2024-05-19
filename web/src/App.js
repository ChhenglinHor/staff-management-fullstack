// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    staffId: '',
    fullName: '',
    birthday: '',
    gender: 1,
  });

  useEffect(() => {
    axios.get('http://localhost:3000/staff').then((response) => {
      setStaff(response.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/staff', form).then((response) => {
      setStaff([...staff, response.data]);
    });
  };

  // Add edit, delete, and search functionalities

  return (
    <div>
      <h1>Staff Management</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="staffId" placeholder="Staff ID" onChange={handleChange} />
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} />
        <input type="date" name="birthday" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
        <button type="submit">Add Staff</button>
      </form>

      <ul>
        {staff.map((member) => (
          <li key={member._id}>{member.fullName}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
