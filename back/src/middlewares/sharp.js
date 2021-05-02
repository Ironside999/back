const sharp = require("sharp");
const path = require("path");

exports.formatImage = async (req, res, next) => {
  if (!req.files?.coverImage || !req.files?.images) return next();

  req.body.coverImage = `/product/product-${
    req.files.coverImage[0].fieldname
  }-${req.body.name}-${Date.now()}.jpeg`;

  req.body.images = [];

  try {
    await sharp(req.files.coverImage[0].buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../photos" + req.body.coverImage)}`);

    // await Promise.all(
    //   req.files.images.map(async (img, indx) => {
    //     const filename = path.join(
    //       __dirname,
    //       `../photos/product/product-${img.fieldname}-${indx + 1}-${
    //         req.body.name
    //       }-${Date.now()}.jpeg`
    //     );
    //     await sharp(img.buffer)
    //       .resize(500, 500)
    //       .toFormat("jpeg")
    //       .jpeg({ quality: 90 })
    //       .toFile(`${filename}`);

    //     req.body.images.push(filename);
    //   })
    // );

    await Promise.all(
      req.files.images.map(async (img, indx) => {
        const filename = `/product/product-${img.fieldname}-${indx + 1}-${
          req.body.name
        }-${Date.now()}.jpeg`;

        await sharp(img.buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${path.join(__dirname, "../photos" + filename)}`);

        req.body.images.push(filename);
      })
    );

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatBanner = async (req, res, next) => {
  if (!req.body.width || !req.body.height || !req.file) return next();

  req.body.banner = `/banner/banner-${req.file.fieldname}-${
    req.body.name
  }-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(+req.body.width, +req.body.height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../photos" + req.body.banner)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatBlogImages = async (req, res, next) => {
  if (
    !req.files?.coverImage ||
    !req.files?.backgroundImage ||
    !req.files?.image
  ) {
    return next();
  }

  req.body.coverImage = `/blog/blog-cover-${
    req.files.coverImage[0].fieldname
  }-${req.body.title}-${Date.now()}.jpeg`;

  req.body.backgroundImage = `/blog/blog-background-${
    req.files.backgroundImage[0].fieldname
  }-${req.body.title}-${Date.now()}.jpeg`;

  req.body.sections = [];

  try {
    await sharp(req.files.coverImage[0].buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../photos" + req.body.coverImage)}`);

    await sharp(req.files.backgroundImage[0].buffer)
      .resize(800, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(
        `${path.join(__dirname, "../photos" + req.body.backgroundImage)}`
      );

    await Promise.all(
      req.files.image.map(async (img, indx) => {
        const filename = `/blog/blog-${img.fieldname}-${indx + 1}-${
          req.body.title
        }-${Date.now()}.jpeg`;

        await sharp(img.buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${path.join(__dirname, "../photos" + filename)}`);

        req.body.sections.push({
          subTitle: req.body.subTitle[indx],
          paragraph: req.body.paragraph[indx],
          image: filename,
          importantLine: req.body.importantLine[indx],
          Num: indx,
        });
      })
    );

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatProfile = async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `/user/user-${req.file.fieldname}-${req.user._id}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../photos" + req.body.photo)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

// exports.formatCompanyPhotos = async (req, res, next) => {
//   if (
//     !req.files?.coverImage ||
//     !req.files?.licensePhoto ||
//     !req.files?.meliCardPhoto ||
//     !req.files?.idCardPhoto
//   ) {
//     return next();
//   }

//   req.body.coverImg = `/company/company-${req.files.coverImage[0].fieldname}-${
//     req.body.companyName
//   }-${Date.now()}.jpeg`;

//   req.body.licensePhoto = `/company/company-${
//     req.files.licensePhoto[0].fieldname
//   }-${req.body.companyName}-${Date.now()}.jpeg`;

//   req.body.meliCardPhoto = `/company/company-${
//     req.files.meliCardPhoto[0].fieldname
//   }-${req.body.companyName}-${Date.now()}.jpeg`;

//   req.body.idCardPhoto = `/company/company-${
//     req.files.idCardPhoto[0].fieldname
//   }-${req.body.companyName}-${Date.now()}.jpeg`;

//   try {
//     await sharp(req.files.coverImage[0].buffer)
//       .resize(400, 400)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`${path.join(__dirname, "../photos" + req.body.coverImg)}`);

//     await sharp(req.files.licensePhoto[0].buffer)
//       .resize(400, 400)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`${path.join(__dirname, "../photos" + req.body.licensePhoto)}`);

//     await sharp(req.files.meliCardPhoto[0].buffer)
//       .resize(400, 400)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`${path.join(__dirname, "../photos" + req.body.meliCardPhoto)}`);

//     await sharp(req.files.idCardPhoto[0].buffer)
//       .resize(400, 400)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`${path.join(__dirname, "../photos" + req.body.idCardPhoto)}`);

//     next();
//   } catch (err) {
//     res.status(400).send({ error: err.name });
//   }
// };

// exports.formatAdImages = async (req, res, next) => {
//   if (!req.files || !req.files?.length) return next();

//   req.body.images = [];

//   try {
//     await Promise.all(
//       req.files.map(async (img, indx) => {
//         const filename = `/Ads/${img.fieldname}-${indx + 1}-${
//           req.user._id
//         }.jpeg`;

//         await sharp(img.buffer)
//           .resize(300, 300)
//           .toFormat("jpeg")
//           .jpeg({ quality: 90 })
//           .toFile(`${path.join(__dirname, "../photos" + filename)}`);

//         req.body.images.push(filename);
//       })
//     );

//     next();
//   } catch (err) {
//     res.status(400).send({ error: err.name });
//   }
// };
