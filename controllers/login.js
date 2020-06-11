module.exports.get = async (ctx, next) => {
  return await ctx.render('pages/login.pug');
}

module.exports.post = (ctx, next) => {
  ctx.session.isAdmin = true;
  ctx.redirect('/admin');
}