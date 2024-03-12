const fs = require('fs');

const toursFile = `${__dirname}/../dev-data/data/tours-simple.json`

const tours = JSON.parse(fs.readFileSync(toursFile))

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.updatetour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'UPDATED TOUR HERE'
    }
  })
}

exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'DELETED'
    }
  })
}