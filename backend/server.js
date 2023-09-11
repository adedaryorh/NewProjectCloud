const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require('./config/db');

const app = express();
connectDB();

// Init middleware
app.use(cors());
app.use('/uploads',express.static('uploads'));
app.use(express.json({extend: false}));
app.use(express.urlencoded({extended: false}))
app.use(morgan("combined"));

app.get('/', ( req, res ) => res.send('Api running'));

// Define route
app.use('/api', require('./routes'));

// handle unknown routes
app.use((req, res) =>
  res.status(404).send({ status: false, message: "Route not found" })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on Port: ${PORT}`));