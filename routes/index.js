const Router = require('koa-router');
const router = new Router();

const homeController = require('../controllers/home');
const loginController = require('../controllers/login');
const adminController = require('../controllers/admin');

const isAdmin = (ctx, next) => {
  if (ctx.session.isAdmin) {
    return next();
  }

  res.redirect('/');
}

router.get('/', homeController.get);
router.post('/', homeController.post);

router.get('/login', loginController.get);
router.post('/login', loginController.post);

router.get('/admin', isAdmin, adminController.get);
// router.post('/admin/upload', isAdmin, adminController.addNewProduct);
// router.post('/admin/skills', isAdmin, adminController.setSkills);

module.exports = router;











// const express = require('express');
// const router = express.Router();

// const homeController = require('../controllers/home');
// const loginController = require('../controllers/login');
// const adminController = require('../controllers/admin');

// const isAdmin = (req, res, next) => {
//   if (!req.session.isAdmin) {
//     next();
//     return;
//   }

//   res.redirect('/');
// }

// router.get('/', homeController.get);
// router.post('/', homeController.post);

// router.get('/login', loginController.get);
// router.post('/login', loginController.post);

// router.get('/admin', isAdmin, adminController.get);
// router.post('/admin/upload', isAdmin, adminController.addNewProduct);
// router.post('/admin/skills', isAdmin, adminController.setSkills);

// module.exports = router;