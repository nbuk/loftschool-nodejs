module.exports.get = (req, res) => {
  res.render('pages/login');
}

module.exports.post = (req, res) => {
  req.session.isAdmin = true;
  res.redirect('/admin');
}