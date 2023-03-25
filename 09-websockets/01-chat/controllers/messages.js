const Message = require('../models/Message');
const mapMessage = require('../mappers/message');
const Session = require('../models/Session');

module.exports.messageList = async function messages(ctx, next) {
   const header = ctx.request.get('Authorization');
   if (!header)
   ctx.throw(401, 'Требуется аутентификация');
   return next();

  const token = header.split(' ')[1];
  if (!token) return next();
  
  const session = await Session.findOne({token}).populate('user');
  console.log(token);
  if (!session) {
    ctx.throw(401, 'Неверный аутентификационный токен');
  }
  const chatID = session.user._id;
  console.log(chatID);
  let messages = await Message.find({chat: chatID}).limit(20);
  messages = messages.map((message) => {
    return {
      id: message.id,
      text: message.text,
      user: message.user,
      date: message.date,
    };});
  
  ctx.body = { messages: messages };
  console.log(ctx.body);
};