import express from 'express';
// import * as Errors from './libs/errors.js';

import { getOptimizedRoute } from './getOptimizedRoute.js';


const PORT = 3000;
const app = express();

app.use(express.json());
app.set('json spaces', 2);

app.post('/routeOptimizer', async function (req, res, next) {
  try {
    res.json(await getOptimizedRoute(req.body));
  }
  catch (error) {
    next(error);
  }
});

app.use(function (err, req, res, next) {
  if (typeof err.status === 'undefined') { // Unkown Error
    res.status(500).json({
      error: {
        message: `Internal server Error: ${err.message}`,
        stack: err.stack,
      },
    });
  }
  else {
    res.status(err.status).json({
      error: {
        message: err.message,
        ...err,
      },
    });
  }

  next();
})

app.all('*', (req, res) => {
  res.send('404 Not found.');
});
 
app.listen(PORT);

console.log(`RouteOptimizer started on port [${PORT}].`);
console.log(`POST to localhost:${PORT}/routeOptimizer to start playing with it.`);