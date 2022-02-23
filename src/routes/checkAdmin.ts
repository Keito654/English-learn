'use strict';

export function checkAdmin(req: any, res: any, next: any) {
  if (req.user === 'maple10032') {
    return next();
  }
  res.redirect('/login');
}