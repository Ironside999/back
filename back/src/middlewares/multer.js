const multer = require("multer");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("file should be an image"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

exports.uploadBanner = upload.single("banner");

exports.uploadBlogImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
  { name: "image", maxCount: 8 },
]);

exports.uploadProfile = upload.single("profile");

// exports.uploadCompanyPhotos = upload.fields([
//   { name: "coverImage", maxCount: 1 },
//   { name: "licensePhoto", maxCount: 1 },
//   { name: "meliCardPhoto", maxCount: 1 },
//   { name: "idCardPhoto", maxCount: 1 },
// ]);

// exports.uploadAdImages = upload.array("adImg");
