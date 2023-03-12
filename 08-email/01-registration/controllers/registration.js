const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    if (!!(await User.findOne({email: ctx.request.body.email}))) {
        ctx.status = 400;
        ctx.body = {errors: {error: "Такой email существует"}};
    }

    const id = uuid();
    const user = await User.create([{email: ctx.request.body.email},
{displayName: ctx.request.body.displayName}, {veryficationToken: id}]);
     // Что возвращает валидатор при ошибке?
    if (!user.email) {
        ctx.status = 400;
        ctx.body = {errors: {error: "Невалидный email"}}
    }

    user.generateSalt();
    user.setPassword(ctx.request.body.password);

    await sendMail({
                template: 'confirmation',
                locals: {token: id},
                to: 'user@mail.com',
                subject: 'Подтвердите почту',
                });

    return next();

};
// При переходе на "confirm" разве не get запрос делается?
module.exports.confirm = async (ctx, next) => {
    const user = await User.findOne({token: ctx.request.body.token});
    if (!user) {
        ctx.status = 400;
        ctx.body = {rerrors: {error: 'Ссылка подтверждения недействительна или устарела'}};
    }
    const session = uuid(); //Что дальше?
    delete user.verificationToken;
    user.updateOne();


    return next();

};

