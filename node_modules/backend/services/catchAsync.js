module.exports = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error(error);
      return res.status(500).json({ message: error.message || "Something went wrong" });
    });
  };
};
