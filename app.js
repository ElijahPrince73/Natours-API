const express  = require('express');

const app =express();

const port = 3000

app.get('/', (req, res) => {
  res.status(200).json({message: 'Hello from server', app: 'Natours'})
})

app.post('/', (req, res) => {
  res.send("You can also post here")
})

app.listen(port, () => {
  console.log('App running on port: ' + port);
})