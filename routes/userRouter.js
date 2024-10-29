var express = require("express"),
  middlewareAuth = require("../app/middleware"),
  jwt = require('jsonwebtoken'),
  config = require('../config'),
  sql = require("../app/database");
EmailCtrl = require("./mailRouter");
var crypto = require("crypto");
const bcrypt = require('bcrypt');
const axios = require("axios");
const CircularJSON = require("circular-json");
const fileUpload = require("express-fileupload");
var fs = require("fs");
const multer = require("multer")({
  dest: "public/files",
});
var geoip = require('geoip-country');
const path = require("path");
var moment = require('moment'); // require
moment().format(); 


var userRoutes = function () {
  var userRouter = express.Router();

  userRouter.get("/datacomplete/:idsuscriber", function (req, res){

    let SQL = "SELECT completeData1 FROM users Where idsuscriber = '" + req.params.idsuscriber + "'";
    console.log(SQL);
    sql
      .execute({
        query: SQL,
      })
      .then(
        function (results) {
          res.json(results[0]);
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

userRouter.get("/guest/:idsuscriber", function (req, res) {
  let SQL = "SELECT * FROM invitados Where id_suscriber = '" + req.params.idsuscriber + "'";
  console.log(SQL);
  sql
    .execute({
      query: SQL,
    })
    .then(
      function (results) {
        res.json(results);
      },
      function (err) {
        console.log("Something bad happened:", err);
      }
    );
})

  userRouter.post("/newGuest", function (req, res) {

    let sqlstr="insert into invitados (nombre, email, fecha,id_suscriber) values("+
    " '" + req.body.nombre + "', "+
    " '" + req.body.email + "', "+
    " GETDATE(), "+
    req.body.id_suscriber + ")"
console.log(sqlstr)
     sql
    .execute({
      query: sqlstr,
    })
    .then(
      function (results) {
        console.log(results);
        res.json({
          success: true,
          message: "Succefull.",
        });
      },
      function (err) {
        console.log("Something bad happened:", err);
      }
    ); 
  })

  //userRouter.use(middlewareAuth); //Require Token for all Routes on this Router
  userRouter.get("/ip/:ip", function (req, res) {

    //var ip = "189.251.72.208";
    let ip =req.params.ip
    console.log( ip)
    var geo = geoip.lookup(ip.trim());
  
    console.log(geo);
    res.send(geo)
  });

  userRouter.post("/log", function (req, res) {
    let sqlstr =
      "INSERT INTO logsbc(accion,ip,so,navegador,lat,long,pais,usuario,fecha) " +
      "values(" +
      "'" + req.body.accion + "'," +
      "'" + req.body.ip + "'," +
      "'" + req.body.so + "'," +
      "'" + req.body.navegador + "'," +
      "'" + req.body.lat + "'," +
      "'" + req.body.long + "'," +
      "'" + req.body.pais + "'," +
      "'" + req.body.usuario + "'," +
      " SYSDATETIME() )";
      console.log(sqlstr)
    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.post("/upload", function (req, res) {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No hay archivo",
        },
      });
    }
    let myFile = req.files.archivo;
    myFile.mv("ilename.jpg", (err) => {
      if (err)
        return res.status(500).json({
          ok: false,
          err: "Ocurrio un error",
        });
      res.json({
        ok: true,
        message: "File uploaded!",
      });
    });
  });

  userRouter.post("/identity", function (req, res) {
    console.log(req.body);
    axios
      .post("https://staging.identitymind.com/im/account/consumer", req.body, {
        headers: {
          authorization: "Basic c21hcnRidXNpbmVzczo1ZWVjOGRjZjc1MWFlM2RkOGE2MzAyNmQ2NzE0NDQ2ZmY0ZmI5ZGFh",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.res);
        //let jsonResp = CircularJSON.stringify(response);
        res.json(response.data.res);
      })
      .catch((error) => {
        console.log(error);
        //res.send (JSON.stringify (error));
      });
  });

  userRouter.put("/avatar", function (req, res) {
    console.log(req.body);
    let sqlstr ;
    switch(req.body.type)
    {
      case 1:   sqlstr = "UPDATE users SET AVATAR = '"                + req.body.avatar + "'  WHERE ID = " + req.body.suscriber; //1
        break;
      case 2:   sqlstr = "UPDATE users SET identificacionAnverso = '" + req.body.avatar + "'  WHERE ID = " + req.body.suscriber; //2
        break;
      case 3:   sqlstr = "UPDATE users SET identificacionReverso = '" + req.body.avatar + "'  WHERE ID = " + req.body.suscriber; //3
        break;
      case 4:   sqlstr = "UPDATE users SET compDomicilio = '"         + req.body.avatar + "'  WHERE ID = " + req.body.suscriber; //4
        break;
    }

    console.log(sqlstr);

    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.put("/show/popup/:id", function (req, res){
    console.log(req.body);

    let sqlstr =
      "UPDATE users SET showPopUp = 0 WHERE IDSUSCRIBER = " + req.params.id;
    console.log(sqlstr);

    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  })

  userRouter.route("/show/popup/:id").get(function (req, res) {
    sql.execute({
        query: "SELECT showPopUp FROM USERS WHERE IDSUSCRIBER = " + req.params.id
      })
      .then(
        function (results) {
          if (results.length > 0) {
            respuesta = {
              showPopUp: results[0].showPopUp
            }
            console.log(respuesta)
            res.json(respuesta);
          } else {
            res.send("No Users Found");
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.put("/wallet", function (req, res) {
    console.log(req.body);
    let wallet =req.body.wallet
    let id_suscriber = req.body.id_suscriber
    let sqlstr =
      "UPDATE users SET WALLET = '" + wallet + "'  WHERE ID = " + id_suscriber;
    console.log(sqlstr);

    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.put("/:id/suscriber", function (req, res) {
    console.log(req.body);
    let sqlstr =
      "UPDATE users SET ISPROSPECT = 1 , IDSUSCRIBER = " + req.body.newIdSuscriber + " WHERE ID = " + req.params.id;
    console.log(sqlstr);

    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.put("/:idSuscriber/beneficiarycomplete", function (req, res) {
    console.log(req.body);
    let sqlstr =
      "UPDATE users SET " + "completeData3 = 1 WHERE ID = '" + req.body.id +
      "'";

    console.log(sqlstr);

    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.put("/", function (req, res) {
    console.log(req.body);
    let sqlstr =
      "UPDATE users SET " + 
      "NAME = '" + req.body.nombre + "'," +
      "LASTNAME ='" + req.body.paterno + "'," +
      "SLASTNAME =  '" + req.body.materno + "'," +
      "TELEPHONE ='" + req.body.telephone + "'," +
      "PC = '" + req.body.cp + "'," +
      "COUNTRY ='" + req.body.Pais + "'," +
      "REFERENCE ='" + req.body.reference + "'," +
      "DATEBORN = '" + req.body.fnacimiento + "'," +
      "GENDER = '" + req.body.genero + "'," +
      "RFC = '" + req.body.RFC + "'," +
      //"ISPROSPECT =0," +
      "STREET = '" + req.body.direccion + "'," +
      "FACEBOOK = '" + req.body.Facebook + "'," +
      "TWITTER = '" + req.body.Twitter + "'," +
      "INSTAGRAM =  '" + req.body.Instagram + "'," +
      "YOUTUBE = '" + req.body.Youtube + "'," +
      "LIKEDIN = '" + req.body.Linkedin + "'," +
      "Aboutme = '" + req.body.Aboutme + "', " +
      "completeData1 = 1" + "," +
      "COUNTRY_CODE = '" + req.body.COUNTRY_CODE + "', " +
      "COLONIA = '" + req.body.COLONIA + "', " +
      "CITY = '" + req.body.CITY + "', " +
      "STATE = '" + req.body.STATE + "', " +
      "NUMBER_INT = '" + req.body.NUMBER_INT + "', " +
      "NUMBER = '" + req.body.NUMBER + "' " +
      " WHERE EMAIL = '" + req.body.email + "'";

    console.log(sqlstr);

    /*let sqlstr = "INSERT INTO users(EMAIL,COUNTRY,STATE,REFERENCE,ISPROSPECT,ISEMAILVAL,LD001,IDEMAILVAL) " +
                        "values("
                        +"'"+req.body.email+"',0,0,0,1,0," + "'"+req.body.password+"  + "',"  + "'"+req.body.idValidator+ "')"*/
    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.post("/evalidate/", function (req, res) {
    console.log("validando");
    let sqlstr =
      "SELECT * FROM users WHERE EMAIL ='" +
      req.body.email +
      "' AND IDEMAILVAL = '" +
      req.body.idval +
      "'";
    console.log(sqlstr);
    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            if (results[0].ISEMAILVAL == "1") {
              res.send({
                status: false,
                message: "Email ya fue validado",
                number: 0,
              });
            } else {
              res.send({
                status: true,
                message: "Su email se valido con èxito",
                number: 1,
              });
              let sqlstr =
                "UPDATE users SET ISEMAILVAL = 1 WHERE EMAIL ='" +
                req.body.email +
                "' AND IDEMAILVAL = '" +
                req.body.idval +
                "'";
              console.log(sqlstr);
              sql.execute({
                query: sqlstr,
              });
            }
          } else {
            res.send({
              status: false,
              message: "La cuenta no existe",
              number: 2,
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.put('/password/change', function(req,res){
    console.log(req.body)
    let id_suscriber = req.body.id_suscriber
    let newPassword = req.body.newPassword;
    let hash = bcrypt.hashSync(newPassword, 10);
    var setNewPsw = "UPDATE users set LD001 = '" + hash + "' Where email = '" +  id_suscriber+"'";
    console.log(setNewPsw)
    sql.execute({
      query: setNewPsw
    }).then(function(results){
      res.json({
        success: true,
        message: "La contraseña se actualizo con éxito",
        errmsg:""
      })
    },
    function (err) {
      res.json({
        success: false,
        message: "",
        errmsg:err
      })
    });
  });

  userRouter.post("/", function (req, res) {
    console.log(req.body)
    let hash = bcrypt.hashSync(req.body.password, 10);
    let sqlstr =
      "INSERT INTO users(EMAIL,COUNTRY,STATE,REFERENCE,ISPROSPECT,ISEMAILVAL,LD001,IDEMAILVAL,SPONSOR) " +
      "values(" +
      "'" +
      req.body.email +
      "','"+req.body.Pais+"',0,0,0,0," +
      "'" +
      hash +
      "'," +
      "'" +
      req.body.idValidator +
      "','"+ req.body.idSuscriberInv +"')";
      console.log(sqlstr)
    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.post("/invitado", function (req, res) {
    console.log("inviado")
    let sqlstr =
      "INSERT INTO invitacion(idSocio,noInvitacion,email, fecha) values('" + req.body.idSocio + "','" + req.body.noInvitacion + "','" +req.body.email +"',  SYSDATETIME() )" ;
      console.log(sqlstr)
    sql
      .execute({
        query: sqlstr,
      })
      .then(
        function (results) {
          console.log(results);
          res.json({
            success: true,
            message: "Succefull.",
          });
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.route("/val/:idInvitacion/:email/invitado").get(function (req, res) {
    let sqlStr =  "select * from invitacion where noinvitacion = '" + req.params.idInvitacion + "' and email = '" + req.params.email + "'";
    console.log(sqlStr)
    sql.execute({
        query: sqlStr,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            console.log(results)
            res.json({
              status:true,
              message:"It's ok"
            });
          } else {
            res.json({
              status:false,
              message:"Nor Found"
            });
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.route("/idgen/:id").get(function (req, res) {
    sql.execute({
        query: "SELECT max(idsuscriber) nextid FROM USERS",
      })
      .then(
        function (results) {
          if (results.length > 0) {
            respuesta = {
              nextid: results[0].nextid
            }
            console.log(respuesta)
            res.json(respuesta);
          } else {
            res.send("No Users Found");
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

    // GET: /api/users
    /*userRouter.route("/:idSuscriber").get(function (req, res) {
      let varsql ="SELECT * FROM users where IDSUSCRIBER = " + req.params.idSuscriber;
      console.log(varsql)
      sql
        .execute({
          query: varsql
        })
        .then(
          function (results) {
            if (results.length > 0) {
              res.json(results);
            } else {
              res.send("No Users Found");
            }
          },
          function (err) {
            console.log("Something bad happened:", err);
          }
        );
    });*/

  // GET: /api/users
  userRouter.route("/").get(function (req, res) {
    sql
      .execute({
        query: "SELECT * FROM users",
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send("No Users Found");
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  // GET: /api/users/
  userRouter.route("/validate/:EMAIL").get(function (req, res) {
    let SQL = "SELECT * FROM users Where EMAIL = '" + req.params.EMAIL + "'";
    console.log(SQL);
    sql
      .execute({
        query: SQL,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            var resp = {
              success: false,
              message: "Email ya fue registrado.",
            };
            res.json(resp);
          } else {
            var resp = {
              success: true,
              message: "Email disponible.",
            };
            res.send(resp);
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  // GET: /api/users/
  userRouter.route("/:email").get(function (req, res) {
    let SQL = "SELECT * FROM users Where EMAIL = '" + req.params.email + "'";
    console.log(SQL);
    sql
      .execute({
        query: SQL,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.send(results[0]);
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.route("/uuid/:uuid").get(function (req, res) {
    console.log(req.params.uuid)
    let SQL = "SELECT * FROM invitacion Where noInvitacion = '" + req.params.uuid + "'";
    console.log(SQL);
    sql
      .execute({
        query: SQL,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            res.send(results[0]);
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );
  });

  userRouter.post("/encrypt", (req, res) => {
    var encryptionMethod = "AES-256-CBC";
    var secret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1"; //WlsIjoiZW5yaXF1ZS5heWFsYS5zb3NhQGdtYWlsLmNvbSJ9.ucNpXNgoe37cXeXnszv3tKPj1qYvkYS3OKzxtA11Cms"; // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEwMTAwMiIsImVtYWlsIjoiZW5yaXF1ZS5heWFsYS5zb3NhQGdtYWlsLmNvbSJ9.ucNpXNgoe37cXeXnszv3tKPj1qYvkYS3OKzxtA11Cms';
    var iv = secret.substring(0, 16);
      console.log(req.body);
      let datos = req.body;
      let dataEncrypt = {};
      datResponse =[]
      for (var clave in datos) {
        console.log("La clave es " + clave + " y el valor es " + datos[clave]);
        let dataToEncrypt = datos[clave];
        console.log(dataToEncrypt);
        var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
        let enData =
          encryptor.update(dataToEncrypt.toString(), "utf8", "base64") +
          encryptor.final("base64");
  
         let data = enData;
        /*let buff = new Buffer.alloc(data)   //Buffer(data); */
        let base64data = Buffer.from(data, 'utf-8').toString('base64');
        dataEncrypt[clave]=base64data;
  
      }

      res.send(dataEncrypt);
  });

  userRouter.post("/request/password",(req,res)=>{

    let SQL = "SELECT * FROM users Where EMAIL = '" + req.body.email + "'";
    console.log(SQL);
    sql
      .execute({
        query: SQL,
      })
      .then(
        function (results) {
          if (results.length > 0) {
            console.log(results)
            var tokenData = {
              id: req.body.email,
              nombre: results[0].NAME + " "+results[0].LASTNAME
            }
            var expires=moment().add(1,"minutes").valueOf();
            var token = jwt.sign(tokenData, config.secret, {
              expiresIn: 60
            })
          
            res.send({
              status:"ok",
              token,
              nombre: results[0].NAME + " "+results[0].LASTNAME
            })
          }else{
            res.json({
              status:"error",
              token:token
            })
          }
        },
        function (err) {
          console.log("Something bad happened:", err);
        }
      );

  })

  return userRouter;
};

module.exports = userRoutes;