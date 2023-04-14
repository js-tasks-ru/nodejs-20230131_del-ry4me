const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server, {
    allowEIO3: true  //false by default
  });

  io.use(async function(socket, next) {
   
    if (!socket.handshake.query.token) {
      next(new Error('anonymous sessions are not allowed'));
    }

    let user = await Session.findOne({token: socket.handshake.query.token});

    if (!user) {
      next(new Error('wrong or expired session token'));
    }

    user = await user.populate('user');
    socket.user = user;
    console.log(socket.user.user.displayName);
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      Message.create({user: socket.user.user.displayName,
      chat: socket.user.user._id, text: msg, date: new Date});
    });
  });

  return io;
}

module.exports = socket;
