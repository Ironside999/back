const crypto = require("crypto");

const generateRandomCode = async (any) => {
  const randomCode = await new Promise((res, rej) => {
    crypto.randomBytes(any, (err, code) => {
      if (err) {
        rej(new Error("FAILED"));
      }
      res(code);
    });
  });

  return randomCode.toString("hex");
};

module.exports = generateRandomCode;
