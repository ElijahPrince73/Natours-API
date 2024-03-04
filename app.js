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

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

app.get('/api/v1/tours/:id', (req, res) => {
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
})

app.post('/api/v1/tours', (req, res) => {
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
})

app.patch('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'UPDATED TOUR HERE'
    }
  })
})

app.delete('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'DELETED'
    }
  })
})

app.listen(port, () => {
  console.log('App running on port: ' + port);
})