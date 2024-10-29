var express = require("express");
const crypto = require("crypto");

var sendpays = function () {
  var sendpay = express.Router();

  sendpay.post("/", function (req, res) {
    console.log(req.body);
    var strLiverpool = encrypt(req.body.Liverpool);
    var strLondres = encrypt(req.body.Londres);
    var strLeicester = encrypt(req.body.Leicester);
    var strBelfast = encrypt(req.body.Belfast);
    var strBradford = encrypt(req.body.Bradford);

    res.json({
      Liverpool: strLiverpool,
      Londres: strLondres,
      Leicester: strLeicester,
      Belfast: strBelfast,
      Bradford: strBradford,
    });
  });

  return sendpay;

  function encrypt(text) {
    const ENCRYPTION_KEY =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEwMTAwMiIsImVtYWlsIjoiZW5yaXF1ZS5heWFsYS5zb3NhQGdtYWlsLmNvbSJ9.ucNpXNgoe37cXeXnszv3tKPj1qYvkYS3OKzxtA11Cms"; // Must be 256 bits (32 characters)

    var hash = crypto.createHash("sha256");
    key = hash.update(ENCRYPTION_KEY);
    key = hash.digest(ENCRYPTION_KEY);

    var iv = crypto.createHash("sha256").update(key).digest("base64");

    console.log(iv.substr(0, 16));
    let cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      iv.substr(0, 16)
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    console.log(Buffer.from(encrypted).toString("base64"));
    let encBase64 = Buffer.from(encrypted).toString("base64");

    return encBase64;
  }
};

module.exports = sendpays;
