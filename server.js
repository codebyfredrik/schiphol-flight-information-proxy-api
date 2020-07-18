import express from 'express';
import cors from 'cors';
// const dotenv = require('dotenv').config();
// import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import morgan from 'morgan';
const app = express();
// const config = require('./config/dataFetchConfig');
// import config from './config/dataFetchConfig';
const port = process.env.PORT || 3001;

// dotenv.config();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // require('dotenv').config();
}

const config = {
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json',
    ResourceVersion: 'v4',
    app_id: process.env.API_ID,
    app_key: process.env.API_KEY,
  },
};

console.log(config);

const options = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(options));
app.use(bodyParser.json());

app.get('/flights', async (req, res) => {
  const {
    fromDateTime,
    page,
    searchDateTimeField,
    sort,
    flightDirection = '',
  } = req.query;
  let url;

  try {
    if (flightDirection) {
      url = `${process.env.API_BASE_URL}/flights?flightDirection=${flightDirection}&fromDateTime=${fromDateTime}&page=${page}&searchDateTimeField=${searchDateTimeField}&sort=${sort}`;
    } else {
      url = `${process.env.API_BASE_URL}/flights?fromDateTime=${fromDateTime}&page=${page}&searchDateTimeField=${searchDateTimeField}&sort=${sort}`;
    }
    const { data } = await axios.get(url, config);
    res.status(200).json(data);
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      error: e.errors,
    });
  }
});

app.get('/airlines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axios.get(
      `${process.env.API_BASE_URL}/airlines/${id}`,
      config
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: e.errors,
    });
  }
});

app.get('/destinations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axios.get(
      `${process.env.API_BASE_URL}/destinations/${id}`,
      config
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: e.errors,
    });
  }
});

app.listen(port, () => console.log(`http://localhost:${port}`));
