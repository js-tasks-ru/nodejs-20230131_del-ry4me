const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }
  const user = User.findOne({email}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }
  });
  if (!user) {
    user = User.create({email, displayName,});
    return (null, user);
  }
  //done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
