const mongoose = require("mongoose");
const validator = require("validator");

const opt = {
  protocols: ["http", "https", "ftp"],
  require_tld: true,
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  host_whitelist: false,
  host_blacklist: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  disallow_auth: false,
};



// console.log(err.stack)

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        "homeBanner",
        "logo",
        "telegram",
        "exhibition",
        "shop",
        "discount",
        "footer",
        "companyLogo",  
      ],
    },
    link: {
      validate(val) {
        if (!validator.isURL(val, opt)) {
          throw new Error("wrong url");
        }
      },
      type: String,
    },
    banner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("banner", bannerSchema);

module.exports = Banner;
