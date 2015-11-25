var crypto = require('crypto');
// firebase config
var Firebase = require('firebase');

var firebase = new Firebase('https://flyingkrai-react-fire.firebaseio.com/');
var users = firebase.child('users'); // users child reference

function hash(password) {
  return crypto.createHash('sha512').update(password).digest('hex');
}

// router config
var router = require('express').Router();

router.use(require('body-parser').json());
router.use(require('cookie-parser')());
router.use(require('express-session')({
  resave: false,
  saveUnitialized: true,
  secret: 'jafja-a-dapdoakm149141jn34j134100b990'
}));

// routes
router.post('/api/signup', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.json({signedIn: false, message: 'No username or password'});
  }

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
  delete req.session.user;

  return res.json({signedIn: false, message: 'You have signed out'});
});

module.exports = router;
