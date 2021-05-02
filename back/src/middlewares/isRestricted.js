const isRestricted = async (req, res, next) => {
  if (!req.user.isRestricted) return next();
  res.status(401).send({ error: "Not Verified" });
};

module.exports = isRestricted;
