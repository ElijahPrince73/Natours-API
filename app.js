const fs = require('fs');
const express  = require('express');
const { error } = require('console');
const { json } = require('body-parser');


const app =express();

// middleware to modify the request by adding the incomeing data to be on the req.body
app.use(express.json())

const port = 3000

const toursFile = `${__dirname}/dev-data/data/tours-simple.json`

const tours = JSON.parse(fs.readFileSync(toursFile))

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

// app.get('/api/v1/tours', getAllTours)

// app.post('/api/v1/tours', createTour)

// app.get('/api/v1/tours/:id', getTour)

// app.patch('/api/v1/tours/:id', updatetour)

// app.delete('/api/v1/tours/:id', deleteTour)

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour)

  app
    .route('/api/v1/tours:id')
    .get(getTour)
    .patch(updatetour)
    .delete(deleteTour)
    

app.listen(port, () => {
  console.log('App running on port: ' + port);
})