const isVerified = async (req, res, next) => {
  if (req.user.isVerified) return next();
  res.status(401).send({ error: "Not Verified" });
};

module.exports = isVerified;
