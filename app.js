const fs = require('fs');
const express  = require('express');
const morgan = require('morgan');
const { error } = require('console');
const { json } = require('body-parser');


const app =express();

// Middleware
app.use(morgan('dev'))
app.use(express.json())

const port = 3000

const toursFile = `${__dirname}/dev-data/data/tours-simple.json`

const tours = JSON.parse(fs.readFileSync(toursFile))


// Route Handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}

const getTour = (req, res) => {
  const id = Number(req.params.id)

  if(id > tours.length) {
    return res.status(404).json({
      status: '404',
      message: "Invalid Id"
    })
  }

  const tour = tours.find(el => el.id === id)

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tour
    }
  })
}

const createTour = (req, res) => {
  const newId = tours.length + 1;
  const newTour = Object.assign({id: newId},req.body)

  tours.push(newTour);

  fs.writeFile(toursFile, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })
}

const updatetour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'UPDATED TOUR HERE'
    }
  })
}

const deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'DELETED'
    }
  })
}

const getAllUsers = (req, res) => {
    res.status(200).json({
    status: 'success',
    data: {
      tour: 'DELETED'
    }
  })
}

const createUser = (req, res) => {
  res.status(500)
}

const getUser = (req, res) =>  {
    res.status(200).json({
    status: 'success',
    data: {
      tour: 'DELETED'
    }
  })
}

const updateUser = (req, res) => {
  res.status(500)
}

const deleteUser = (req, res) => {
  res.status(500)
}

// Routes

const toursRouter = express.Router()
const userRouter = express.Router()

app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', toursRouter)

  toursRouter
    .route('/')
    .get(getAllTours)
    .post(createTour)

  toursRouter
    .route('/:id')
    .get(getTour)
    .patch(updatetour)
    .delete(deleteTour)
    
  userRouter.route('/')
      .get(getAllUsers)
      .post(createUser)

  userRouter.route('/:id')
      .get(getUser)
      .patch(updateUser)
      .delete(deleteUser)

  // Server
  app.listen(port, () => {
    console.log('App running on port: ' + port);
  })