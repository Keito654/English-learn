'use strict';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkAdmin... Remove this comment to see the full error message
function checkAdmin(req: any, res: any, next: any) {
  if (req.user === 'maple10032') {
    return next();
  }
  res.redirect('/login');
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = checkAdmin;