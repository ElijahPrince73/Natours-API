const fs = require('fs');
const express  = require('express');


const app =express();

const port = 3000

// app.get('/', (req, res) => {
//   res.status(200).json({message: 'Hello from server', app: 'Natours'})
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`))

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

app.post('/', (req, res) => {
  res.send("You can also post here")
})

app.listen(port, () => {
  console.log('App running on port: ' + port);
})