const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require(`./app`);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('Db connecton successful');
});
const port = process.env.PORT;
app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port ${port}`);
});
