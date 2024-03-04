const fs = require('fs');
const express  = require('express');
const { error } = require('console');


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

app.listen(port, () => {
  console.log('App running on port: ' + port);
})