class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1) Basic filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    const advancedQuery = {};

    Object.keys(queryObj).forEach((key) => {
      // Check if it's an advanced filter pattern: field[operator]
      const match = key.match(/^(\w+)\[(\w+)\]$/);

      if (match) {
        const field = match[1];
        const operator = match[2];

        // Convert operator to MongoDB format
        if (['gte', 'gt', 'lte', 'lt'].includes(operator)) {
          if (!advancedQuery[field]) advancedQuery[field] = {};
          advancedQuery[field][`$${operator}`] = queryObj[key];
        }
      } else {
        // Regular equality filter
        advancedQuery[key] = queryObj[key];
      }
    });

    console.log('MongoDB Query:', advancedQuery);
    this.query = this.query.find(advancedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitingFields() {
    if (this.queryString.fields) {
      // FIX: Use this.queryString.fields instead of this.query.fields
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // FIX: Use parseInt instead of * 1 for more reliable type conversion
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIfeatures;
