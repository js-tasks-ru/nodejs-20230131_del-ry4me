const app = require('./app');


const server = app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});

const socket = require('./socket');


socket(server);
