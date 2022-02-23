'use strict';

function checkAdmin(req, res, next) {
  if (req.user === 'maple10032') {
    return next();
  }
  res.redirect('/login');
}

module.exports = checkAdmin;