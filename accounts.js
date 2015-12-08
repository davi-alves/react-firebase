var crypto = require('crypto');
// firebase config
var Firebase = require('firebase');

var firebase = new Firebase('https://flyingkrai-react-fire.firebaseio.com/');
var users = firebase.child('users'); // users child reference

/**
 * Hash a password with sha512
 *
 * @param  {String} password password
 * @return {String}
 */
function hash(password) {
  return crypto.createHash('sha512') // create a hash
    .update(password) // applies the given password
    .digest('hex'); // return de hashed value
}

// router config
var router = require('express').Router();

router
  .use(require('body-parser').json()) // parse json request body
  .use(require('cookie-parser')())
  .use(require('express-session')({
    resave: false,
    saveUninitialized: true,
    secret: 'jafja-a-dapdoakm149141jn34j134100b990'
  }));

// routes
router.post('/api/signup', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.json({signedIn: false, message: 'No username or password'});
  }

  // fetching a subchild (creates if does not exists)
  // with .once it will happen only once within the request
  users.child(username).once('value', function (snapshot) {
    if (snapshot.exists()) {
      return res.json({signedIn: false, message: 'Username already in use'});
    }

    var user = {
      username: username,
      passwordHash: hash(password)
    };

    users.child(username).set(user);
    req.session.user = user;

    res.json({signedIn: true, user: user});
  });
});

router.post('/api/signin', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.json({signedIn: false, message: 'No username or password'});
  }

  users.child(username).once('value', function (snapshot) {
    if (!snapshot.exists() || snapshot.child('passwordHash').val() !== hash(password)) {
      return res.json({signedIn: false, message: 'Wrong username or password'});
    }

    var user = snapshot.exportVal();
    req.session.user = user;

    res.json({signedIn: true, user: user});
  });
});

router.post('/api/signout', function (req, res) {
  delete req.session.user; // clears the user in session

  return res.json({signedIn: false, message: 'You have signed out'});
});

module.exports = router;
