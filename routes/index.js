const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');
const loginController = require('../controllers/login');
const adminController = require('../controllers/admin');

const isAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    next();
    return;
  }

  res.redirect('/');
}

router.get('/', homeController.get);
router.post('/', homeController.post);

router.get('/login', loginController.get);
router.post('/login', loginController.post);

router.get('/admin', isAdmin, adminController.get);
router.post('/admin/upload', isAdmin, adminController.post);

module.exports = router;