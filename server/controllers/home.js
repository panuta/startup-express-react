import path from 'path'

const home = async (req, res, next) => {
  res.sendFile(path.join(__dirname, '../templates/home.html'))
}

export {
  home
}
