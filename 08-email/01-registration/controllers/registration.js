const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    if (!!(await User.findOne({email: ctx.request.body.email}))) {
        ctx.status = 400;
      ctx.body({errors: {error: "Такой email уже существует"}});
    }

    const verificationToken = uuid();
    const user = await User.create({email: ctx.request.body.email,
    displayName: ctx.request.body.displayName, veryficationToken,});
     // Что возвращает валидатор при ошибке?
    /**if (!user.email) {
        ctx.status = 400;
        ctx.body = {errors: {error: "Невалидный email"}}
    }*/

  await user.setPassword(ctx.request.body.password);
  await user.save();

  await sendMail({
    to: user.email,
    subject: 'Подтвердите почту',
    locals: {token: verificationToken},
    template: 'confirmation',
                });

  ctx.body = {status: 'ok'};
};
// При переходе на "confirm" разве не get запрос делается?
module.exports.confirm = async (ctx, next) => {
    const user = await User.findOne({verificationToken: ctx.request.body.verificationToken});
    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }
  user.verificationToken = undefined;
  await user.save();

  const token = uuid();

  ctx.body = {token};

};



