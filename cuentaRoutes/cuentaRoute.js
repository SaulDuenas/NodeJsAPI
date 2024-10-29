var express = require("express"),
  //middlewareAuth = require('../app/middleware'),
  sql = require("../app/database");

var cuentaRoutes = function () {
  var cuentaRouter = express.Router();

  cuentaRouter.post("/retiro", function(req, res){
    var sqlInsertRetiro =
    "INSERT INTO retiros(id_cuenta,id_suscriber,ret_fec,ret_usd,Ret_Tipo ) " +
    "values(" +
    req.body.id_cuenta +
    "," +
    req.body.id_suscriber +
    ",SYSDATETIME()," +
    req.body.ret_usd +
    ",1); ";
    console.log(sqlInsertRetiro)
    sql.execute({
      query: sqlInsertRetiro,
    }).then(function (results) {
      res.json(
        {
          status:"ok",
          message:"El retiro se realizó con éxito"
        }
      )
    },function (err) {
      res.json(
        {
          status:"fail",
          message:err
        }
      )
    });
  });

  cuentaRouter.post("/new", function (req, res) {
    
    var lastId;
    var sqlstr =
      "INSERT INTO cuenta(id_suscriber,id_plan,fec_contrat,monto,porcent) " +
      "values(" +
      req.body.id_susciber +
      "," +
      req.body.id_plan +
      ",'" +
      req.body.fec_contrat +
      "'," +
      req.body.monto +
      "," +
      req.body.porcent +
      "); ";

    console.log(sqlstr);
    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {

           sql.execute({
            query: "SELECT IDENT_CURRENT('cuenta') last;"  ,
          })
          .then(function(data)
          {
            /******************************************************************* */
            sql.execute({
              query: "update cuenta set id_cuenta= " +data[0]["last"]+ "where id = " + data[0]["last"],
              })
                .then(function(res)
              {
    
              }); 
            /******************************************************************* */
            sql.execute({
            query: "INSERT INTO Rendim (id_cuenta,id_Socio,Rend_fec)values( "+ data[0]["last"] +","+req.body.id_susciber+",'')"  ,
            })
              .then(function(res)
            {

            }); 
            lastId = data[0]["last"];
            console.log(lastId);
            res.json({
              success: true,
              message: "Succefull",
              lastIdCuenta: data[0]["last"]
            });
          }); 
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

 

  cuentaRouter.route("/estado/:cliente").get(function (req, res) 
  {

     strQuery =
    "select fec_iniretiro, TipoPlanes.Description,RPercent,dbo.Cuenta.fec_contrat fec_inicalc, dbo.cuenta.id_cuenta,monto, 'C' tipo,TipoPlanes.isPlan,DATEDIFF (DAY, GETDATE() , fec_iniretiro )  as resultado "+
    "from dbo.Cuenta,TipoPlanes,Rendim "+
    "where (dbo.Cuenta.id_cuenta= Rendim.id_cuenta and dbo.Cuenta.Id_plan= TipoPlanes.Plan_ID) and Id_suscriber=  " +
    req.params.cliente +
    "group by dbo.cuenta.id_cuenta, monto,TipoPlanes.Description,dbo.Cuenta.fec_contrat,RPercent,fec_iniretiro,TipoPlanes.isPlan "+
    "union "+
    "SELECT fec_iniretiro, TipoPlanes.Description,RPercent,dbo.Cuenta.fec_contrat fec_inicalc,dbo.cuenta.Id_cuenta, MAX(Ren_USD) as monto, 'I' tipo,TipoPlanes.isPlan,DATEDIFF (DAY, GETDATE() , fec_iniretiro )  as resultado "+
    "from dbo.Cuenta,TipoPlanes,Rendim "+
    "where (dbo.Cuenta.id_cuenta= Rendim.id_cuenta and dbo.Cuenta.Id_plan= TipoPlanes.Plan_ID) and Id_suscriber=  "+
    req.params.cliente +
    "GROUP BY dbo.cuenta.id_cuenta,TipoPlanes.Description,dbo.Cuenta.fec_contrat,RPercent,fec_iniretiro,TipoPlanes.isPlan "+
    "ORDER BY dbo.cuenta.id_cuenta,TipoPlanes.Description" 
 

            var responseData = {};
            var EdoCta = [];
            var idCuenta;
            let retiro;
    console.log(strQuery);
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          OKc = false;
          OKi = false;
          if (results.length > 0) {

            for (var atr in results) {
/*               let sql_retiros="select sum( Ret_USD) retiros from Retiros where id_Suscriber="+req.params.cliente  
              sql.execute({
                query: sql_retiros,
              })
              .then(
                function (r) {
                  if (r.length > 0) {
                    console.log(results[atr].id_cuenta)
                    retiro = r[0]["retiros"]
                    responseData["retiros"] = r[0]["retiros"]
                  }
              }) */

              responseData["isPlan"] = results[atr].isPlan;;
              responseData["isSelected"] = false;
              responseData["idcuenta"] = results[atr].id_cuenta;
              idCuenta = results[atr].id_cuenta;
              responseData["Description"] = results[atr].Description;
              responseData["RPercent"] = results[atr].RPercent;
              responseData["days"] = results[atr].resultado;
              responseData["fechaInicio"] = results[atr].fec_inicalc;
              responseData["fechaInicioRetiro"] = results[atr].fec_iniretiro;

              if (results[atr].tipo == "C") {
                OKc = true;
                responseData["capital"] = results[atr].monto;
              }
              if (results[atr].tipo == "I") {
                OKi = true;
                responseData["Acumulado"] = results[atr].monto;
              }
                        
              console.log(responseData["Acumulado"])
              if(responseData["Acumulado"] === null || responseData["Acumulado"] === undefined)
                responseData["Acumulado"] =responseData["capital"]


                responseData["retiros"] = retiro
              if (OKi && OKc) {
                EdoCta.push(responseData);
                console.log(responseData);
                console.log("------------------------------------------");
                responseData = {};
                OKi = false;
                OKc = false;
              }
            }
            res.send(EdoCta);
          } else {
            res.send({
              status:false,
              message:"Not found"
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        })
  });


  function retiros(id){
let sql_retiros="select sum( Ret_USD) retiros from Retiros where id_Suscriber="+id 

    sql.execute({
      query: sql_retiros,
    })
    .then(
      function (results) {
        if (results.length > 0) {
          console.log(results[0]["retiros"])
          return results[0]["retiros"];
        }
      })
  }

  cuentaRouter.route("/:cuenta/plan").get(function (req, res) {
    strQuery = "SELECT * FROM Cuenta WHERE id_cuenta = " + req.params.cuenta;
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send({
              status:false,
              message:"Not found"
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  cuentaRouter.route("/:cliente/:type").get(function (req, res) {
    if (req.params.type == "M")
      strQuery =
        "SELECT * FROM Cuenta WHERE Id_suscriber=" +
        req.params.cliente +
        " and (Id_plan=1 or Id_plan=3)";
    if (req.params.type == "P")
      strQuery =
        "SELECT * FROM Cuenta WHERE Id_suscriber=" +
        req.params.cliente +
        " and (Id_plan<>1 and Id_plan<>3)";

    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send({
              status:false,
              message:"Not found"
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  //Obtiene rendimientos cuenta, mes año
  cuentaRouter.route("/:cuenta/rendimientos/:mes/:year").get(function (req, res) {
      strQuery =
        "SELECT * FROM Rendim where id_cuenta= " +
        req.params.cuenta +
        " and REN_mes=" +
        req.params.mes +
        " and REN_anio=" +
        req.params.year +
        " order by Rend_fecn desc";
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
                status: "fail",
              });
            }
          },
          function (err) {
            console.log("Something bad happened:", err);
          }
        );
    });

  cuentaRouter.route("/:cuenta/rendimientos/:param").get(function (req, res) {
    strQuery = "";
    if (req.params.param == "TOP5") {
      strQuery =
        "SELECT TOP 5 * FROM Rendim WHERE id_cuenta=" + req.params.cuenta+ " order by Rend_fecn desc";;
    }
    if (req.params.param == "ALL") {
      strQuery = "SELECT * FROM Rendim WHERE id_cuenta=" + req.params.cuenta + " order by Rend_fecn desc";
    }
    if (req.params.param == "MAX") {
      strQuery =
        "SELECT MAX(Ren_USD) as TOTAL FROM Rendim WHERE id_cuenta=" +
        req.params.cuenta+ " order by Rend_fecn desc";
    }
    console.log(strQuery);
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send({
              status:false,
              message:"Not found"
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  cuentaRouter.route("/plan/:cliente/customer").get(function (req, res) {
    strQuery =
      "SELECT * FROM Cuenta INNER JOIN TipoPlanes on Cuenta.id_plan = tipoplanes.plan_id WHERE Id_suscriber= " +
      req.params.cliente; //+ " and (Id_plan<>1 and Id_plan<>3)"
    //strQuery = "SELECT * FROM Cuenta WHERE Id_suscriber=" + req.params.cliente + " and (Id_plan<>1 and Id_plan<>3)";
    console.log(strQuery);
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send({
              status:false,
              message:"Not found"
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  cuentaRouter.route("/plan/selectplan/:idplan").get(function (req, res) {
    strQuery =
      "SELECT Description, USDCost, RPercent FROM TipoPlanes WHERE Plan_ID=" +
      req.params.idplan;
    console.log(strQuery);
    sql
      .execute({
        query: strQuery,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send({
              status:false,
              message:"Not found"
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });
  return cuentaRouter;
};

module.exports = cuentaRoutes;
