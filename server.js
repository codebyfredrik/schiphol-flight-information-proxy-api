import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import axios from './helpers/axios';

const app = express();
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
      url = `/flights?flightDirection=${flightDirection}&fromDateTime=${fromDateTime}&page=${page}&searchDateTimeField=${searchDateTimeField}&sort=${sort}`;
    } else {
      url = `/flights?fromDateTime=${fromDateTime}&page=${page}&searchDateTimeField=${searchDateTimeField}&sort=${sort}`;
    }
    const { data, lastPage } = await axios.get(url, {
      ...axios.default,
      parse: true,
    });
    if (data) {
      console.log('lastPage: ', lastPage);
    }

    res.status(200).json({ data, lastPage });
  } catch (e) {
    res.status(500).json({
      error: e.errors,
    });
  }
});

app.get('/airlines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axios.get(`/airlines/${id}`);
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
    const { data } = await axios.get(`/destinations/${id}`);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: e.errors,
    });
  }
});

app.get('/flights/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axios.get(`/flights/${id}`);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: e.errors,
    });
  }
});

app.get('/aircrafttypes', async (req, res) => {
  const { iataSub } = req.query;

  try {
    const { data } = await axios.get(`/aircrafttypes?iataSub=${iataSub}`);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: e.errors,
    });
  }
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
