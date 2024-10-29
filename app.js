var bodyParser = require("body-parser"),
  appRootDir = require("app-root-dir").get(),
  path = require("path");
var cors = require("cors");
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var fs = require('fs');

var https = require('https');
var http = require('http');
var privateKey  = fs.readFileSync('privkey.key', 'utf8');
var certificate = fs.readFileSync('5f8ed9eda39f87bb.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.use(cors());
// default options
app.use(fileUpload());

var PORT = process.env.port || 3000;
app.use(fileUpload());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

authenticateRouter = require("./routes/authenticateRouter")();
userRouter = require("./routes/userRouter")();
paisRouter = require("./routes/paisesRouter")();
cityRouter = require("./routes/cityRouter")();
sponsorRouter = require("./routes/sponsorRouter")();
beneficiariosRouter = require("./routes/beneficiarios")();
cuentaRouter = require("./cuentaRoutes/cuentaRoute")();
calculosRouter = require("./cuentaRoutes/calculosRoute")();
orgRouter = require("./organization/organizationRoute")();
cryptoSend = require("./crypto/crypto")();
rendimientosRouter = require("./cuentaRoutes/rendimientosRouter")();
comisionesRouter = require("./comisiones/comisiones")();
frontRouter = require("./routes/frontRouter")();
detailsRouter = require("./routes/detailsRouter")();
var EmailCtrl = require("./routes/mailRouter");

app.use(require('./routes/uploads'));

app.use("/api/comisiones", comisionesRouter);
app.use("/api/cuenta", cuentaRouter);
app.use("/api/rendimientos", rendimientosRouter)
app.use("/api/sendpay", cryptoSend);
app.use("/api/calculate", calculosRouter);
app.use("/api/beneficiarios", beneficiariosRouter);
app.use("/authenticate", authenticateRouter);
app.use("/api/users", userRouter);
app.use("/api/countries", paisRouter);
app.use("/api/cities", cityRouter);
app.use("/api/sponsor", sponsorRouter);
app.use("/api/organization", orgRouter);
app.use("/api/frontend", frontRouter);
app.use("/api/details", detailsRouter);

//email route
app.post("/api/email", EmailCtrl.sendEmail);

// Default API Landing Page
app.get("/", function (req, res) {
  res.sendFile(path.join(appRootDir + "/views/index.html"));
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
//httpsServer.listen(5001);
/*https.createServer({
  key: fs.readFileSync('sbc.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(PORT, function(){
  console.log("My https server listening on port " + PORT + "...");
});*/