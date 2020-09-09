
const home = async (req, res, next) => {
  res.render('home', { title: 'Express' })
}

export {
  home
}
