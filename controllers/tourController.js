const Tour = require('../model/tourModel');
const APIfeatures = require('../util/APIfeatures');

exports.aliasTopTours = (req, res, next) => {
  // Create a new object instead of modifying
  req.query = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //  Execute query
    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitingFields()
      .paginate();
    const tours = await features.query;

    //  Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      tour: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid ID format',
    });
  }
};

exports.CreateTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.UpdateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
exports.DeleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
