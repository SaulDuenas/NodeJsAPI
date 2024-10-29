var express = require("express"),
  //middlewareAuth = require('../app/middleware'),
  sql = require("../app/database");

var comisionesRoutes = function () {
  var comisionesRouter = express.Router();

  comisionesRouter.route("/all/:idSuscriptor").get(function (req, res) {
    strQuery =
      "SELECT Comis_USD  , FORMAT(Comis_Fec,'dd/MM/yyyy') Fecha FROM comisiones where ID_suscriber =" +
      req.params.idSuscriptor + " order by Fecha ASC";
    console.log(strQuery);
    var responseDataX = {};
    var responseDataY = {};
    var dataX = [];
    var dataY = [];
    var data = [];
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          for (var atr in results) {
            dataX.push(results[atr].Comis_USD);
            dataY.push(results[atr].Fecha);
          }
          data.push({ X: dataX });
          data.push({ Y: dataY });
          res.send(data);
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  comisionesRouter.route("/porcobrar/:idSuscriptor").get(function (req, res) {
    strQuery =
    " SELECT ID_Suscriber,descripcion,lastname,slastname,Comis_Fec,Comis_Porc,Comis_Orig,Comis_USD,Comis_FecP, hashPago "+
    " FROM comisiones, users, Tipos_Comisiones "+
    " where (comisiones.ID_SuscGen=users.IDSUSCRIBER and comisiones.Comis_tipo = Tipos_Comisiones.tipo ) and "+
    " (Comis_Status = 0 and ID_suscriber =" +
       req.params.idSuscriptor +")";
    console.log(strQuery);
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json({
              status: "ok",
              data: results,
            });
          } else {
            res.json({
              status: "error",
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  comisionesRouter.route("/cobradas/:idSuscriptor").get(function (req, res) {
    strQuery =
   " SELECT ID_Suscriber,descripcion,lastname,slastname,Comis_Fec,Comis_Porc,Comis_Orig,Comis_USD,Comis_FecP "+
   " FROM comisiones, users, Tipos_Comisiones "+
   " where (comisiones.ID_SuscGen=users.IDSUSCRIBER and comisiones.Comis_tipo = Tipos_Comisiones.tipo ) and "+
   " (Comis_Status = 1 and ID_suscriber =" +
      req.params.idSuscriptor +")";
    console.log(strQuery);
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json({
              status: "ok",
              data: results,
            });
          } else {
            res.json({
              status: "error",
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  comisionesRouter.route("/bono/:idSuscriptor").get(function (req, res) {
    strQuery =
      "SELECT * FROM NivelesBono WHERE id_Suscriber= " +
      req.params.idSuscriptor;
    console.log(strQuery);
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json({
              status: "ok",
              data: results,
            });
          } else {
            res.json({
              status: "error",
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  return comisionesRouter;
};

module.exports = comisionesRoutes;
