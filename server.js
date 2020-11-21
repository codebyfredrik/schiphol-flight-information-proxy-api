import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import createError from 'http-errors';
import axios from './helpers/axios';
import { catchAsync } from './helpers/catchAsync';

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

app.get(
  '/flights',
  catchAsync(async (req, res) => {
    const {
      fromDateTime,
      page,
      searchDateTimeField,
      sort,
      flightDirection = '',
    } = req.query;
    let url;

    if (flightDirection === 'A' || flightDirection === 'D') {
      url = `/flights?flightDirection=${flightDirection}&fromDateTime=${fromDateTime}&page=${page}&searchDateTimeField=${searchDateTimeField}&sort=${sort}`;
    } else {
      url = `/flights?fromDateTime=${fromDateTime}&page=${page}&searchDateTimeField=${searchDateTimeField}&sort=${sort}`;
    }

    const { data, lastPage } = await axios.get(url, {
      parse: true,
    });

    if (!data) {
      throw createError(404, 'No flights type does not exist!');
    }

    res.status(200).json({ data, lastPage });
  })
);

app.get(
  '/airlines/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { data } = await axios.get(`/airlines/${id}`);

    if (!data) {
      throw createError(404, 'This airline does not exist!');
    }

    res.status(200).json(data);
  })
);

app.get(
  '/destinations/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { data } = await axios.get(`/destinations/${id}`);

    if (!data) {
      throw createError(404, 'This destination does not exist!');
    }

    res.status(200).json(data);
  })
);

app.get(
  '/flights/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { data } = await axios.get(`/flights/${id}`);

    if (!data) {
      throw createError(404, 'This flight does not exist!');
    }

    res.status(200).json(data);
  })
);

app.get(
  '/aircrafttypes',
  catchAsync(async (req, res) => {
    const { iataSub } = req.query;
    const { data } = await axios.get(`/aircrafttypes?iataSub=${iataSub}`);

    if (!data) {
      throw createError(404, 'This aircraft type does not exist!');
    }

    res.status(200).json(data);
  })
);

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
