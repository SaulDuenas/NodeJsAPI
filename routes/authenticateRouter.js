var express = require('express'),
    jwt = require('jsonwebtoken'),
    User = require('../app/user'),
    config = require('../config'),
    app = express();
    sql = require('../app/database');

const bcrypt = require('bcrypt');
const exec = require('child_process').exec


var authenticateRouter = function () {

  var authRouter = express.Router();
  let authenticated = false;
  // POST: /authenticate/  -- authenticates the user and returns token
  authRouter.post('/logout', function(req,res){
    sql.execute({
      query: "update users set ipactiva = 'noip' where EMAIL = '" +  req.body.email + "'"

    }).then(function (results) {
      res.json(
        {
          success: true,
          message: 'Sesión cerrada',
        }
      )
      console.log("Sesión eliminada")
    })
  });


  authRouter.get("/genpass/:p", function (req, res) {

    let hash = bcrypt.hashSync('Azulvioleta1', 10);
    res.json({
      statos:"ok",
      hash: hash
    })
    
    });



    authRouter.post("/valpass", function(req,res){
      let hash = req.body.hash; 
    hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
    console.log(req.body.pws)
    bcrypt.compare(req.body.pws, hash, function(err, resp) {
           console.log(resp);
        res.send({
          status:"ok",
          respuesta:resp,
          pas:req.body.pws
        })
    });
    })
    
  authRouter.put('/password/change', function(req,res){
console.log(req.body)
      let id_suscriber = req.body.id_suscriber
      let oldPassword = req.body.oldPassword;
      let newPassword = req.body.newPassword;

      var StrSqlValUser = "SELECT * FROM users Where ID = " +  id_suscriber + " and LD001 = '" + oldPassword + "'";
console.log(StrSqlValUser)
      sql.execute({
        query: StrSqlValUser
  
      }).then(function (results) {
        if (results.length > 0) {

          var setNewPsw = "UPDATE users set LD001 = " + newPassword + " Where ID = " +  id_suscriber;
          sql.execute({
            query: setNewPsw
          }).then(function(results){
            res.json({
              success: true,
              message: "La contrseña se actualizo con éxito",
              errmsg:""
            })
          },
          function (err) {
            res.json({
              success: false,
              message: "",
              errmsg:err
            })
          }
          );

        }else{
          res.json({
            success: false,
            message: "La contrseña actual no es válida",
            errmsg:"not found"
          });
        }

      })



    });

  authRouter.post('/', function (req, res) {
    
    var StrSqlValEmail = "SELECT * FROM users Where EMAIL = '" +  req.body.email + "'";
    console.log(StrSqlValEmail)
    sql.execute({
      query: StrSqlValEmail

    }).then(function (results) {
      if (results.length > 0) {
        if (results[0].ISEMAILVAL == "0") {
          console.log("Email no validado")
          res.json({
            success: false,
            message: 'Email no validado',
            token: ""
          });
          return;
        } else {

          if (results.length > 0) {
           // console.log("ip activa" + results[0].ipactiva.trim())
           // console.log("ip actual" + req.body.ReqIp.trim())
            // if ((results[0].ipactiva == "noip") || (results[0].ipactiva.trim() == req.body.ReqIp.trim()))
            //{
              hash = results[0].LD001.replace(/^\$2y(.+)$/i, '$2a$1');
              bcrypt.compare(req.body.password, hash, function(err, resp) {
   console.log(req.body.password + " -  " + req.body.password)
                if(resp==true){
                  console.log("Entro")
                  var user = {
                  FirstName: results[0].NAME,
                  SecondName: results[0].SNAME,
                  LastName: results[0].LASTNAME,
                  UserName: results[0].SLASTNAME,
                  Email: results[0].EMAIL,
                  Telephone: results[0].TELEPHONE,
                  City: results[0].CITY,
                  Password: results[0].LD001,
                  find_out: results[0].REFERENCE,
                  id_cliente: results[0].IDSUSCRIBER,
                  isProspect: results[0].ISPROSPECT,
                  idGenerico: results[0].ID,
                  dataComplete: results[0].completeData1,
                  avatar: results[0].avatar,
                  identificacionAnverso: results[0].identificacionAnverso,
                  identificacionReverso: results[0].identificacionReverso,
                  compDomicilio: results[0].compDomicilio,
                  showPopUp:results[0].showPopUp,
                }
  
                  var token = jwt.sign(user, config.secret, {
                    expiresIn: '30m' // token expires in 30 minutes, can be days like 100d, etc.
                  });
    
                  res.json({
                    success: true,
                    message: 'success',
                    token: token
                  });
                }else{
                  res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                  });
                }

      
              });
          } else {

            res.json({
              success: false,
              message: 'Error de conexion.'
            });
          }
        }
      } else {
        res.json({
          success: false,
          message: 'Error cnx.'
        });
      }
    });
  });
  return authRouter;
}


module.exports = authenticateRouter;