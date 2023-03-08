const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    

    /** async function(email, password, done) {
      const user = await User.findOne({email: email});

      if (!user) {
        done(null, false, 'Нет такого пользователя');
      }

      user.checkPassword(password) ? done(null, user) : done(null, false, 'Неверный пароль');

      done(null, false, 'Стратегия подключена, но еще не настроена');
    },
    */
   function(email, password, done) {

    User.findOne({email}, function(err, user) {
      if (err) {
        return done(err);}
      if (!user) {
        return done(null, false, 'Нет такого пользователя');}
      if (!user.checkPassword(password)) {
        return done(null, false, 'Неверный пароль');}
      return done(null, user);
    });
   }
);
