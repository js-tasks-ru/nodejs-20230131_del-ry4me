const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
 /**  if (!email) {
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
    User.create({email, displayName,});
    done(null, user);
  }
  */
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  try {
    let user = await User.findOne({email});

    if (user) {
      return done(null, user);
    }

    user = await User.create({
      email, displayName,
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
  
  //done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
