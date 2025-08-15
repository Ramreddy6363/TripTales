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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);

    const plan = await Tour.aggregate([
      // Step 1: Unwind the array to get one document per start date
      {
        $unwind: '$startDates',
      },

      // Step 2: Match only dates in the requested year
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      // Step 3: Group by month (ONLY ONE GROUP STAGE)
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },

      // Step 4: Add month field
      {
        $addFields: { month: '$_id' },
      },

      // Step 5: Project (remove _id)
      {
        $project: {
          _id: 0,
        },
      },
      // Step 6: Sort by number of tours (descending)
      {
        $sort: { numTourStarts: -1 },
      },

      // Step 7: Limit to top 6 months
      {
        $limit: 6,
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: { plan },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
