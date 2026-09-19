module.exports = (fn) => {
  return (res, req, next) => {
    fn(res, req, next).catch(next)((error) => {
      return res.status(500).json({message: error.message})
    })
  }
}
