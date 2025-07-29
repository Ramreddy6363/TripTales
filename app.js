const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes')
const userRouter = require('./Routes/userRoutes')
const app = express()
// 1. middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// app.get('/', (req, res) => {
//   res
//     .status(404)
//     .json({ message: 'hello from the server side', app: 'naturos' });
// });


// 2. Route handlers


// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', CreateTour);
// app.patch('api/v1/tours/:id', UpdateTour);
// app.delete('api/v1/tours/:id', DeleteTour);

// 3. Routes

app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

// 4. Server
module.exports = app;