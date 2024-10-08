const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTOurs = (req, res) => {
  console.log(req.requestTime);
  res.status(200).send({
    status: 'succes',
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'Failed', message: 'invalid id' });
  }
  res.status(200).send({ status: 'succes', data: { tour } });
};

exports.createTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      if (error) {
        return res.status(404).json({ message: error.message });
      }

      res.status(201).json({
        status: 'Success',
        data: { tour: newTour },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (!tour) {
    return res.status(404).json({ status: 'Failed', message: 'invalid id' });
  }
  return res
    .status(200)
    .json({ status: 'Success', data: { tour: 'Updated tour here' } });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (!tour) {
    return res.status(404).json({ status: 'Failed', message: 'invalid id' });
  }
  return res.status(204).json({ status: 'Success', data: null });
};

exports.checkData = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res
      .status(400)
      .json({ status: 'Failed', message: 'Missin price or name' });
  }
  next();
};
