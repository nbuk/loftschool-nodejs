module.exports.get = (req, res) => {
  res.render('pages/index');
}

module.exports.post = (req, res) => {
  console.log(req.body);
}