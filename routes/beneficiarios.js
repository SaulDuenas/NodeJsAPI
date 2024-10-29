var express = require("express"),
    middlewareAuth = require("../app/middleware"),
    sql = require("../app/database");
EmailCtrl = require("./mailRouter");
const axios = require("axios");
const CircularJSON = require("circular-json");
const fileUpload = require('express-fileupload');
var fs = require("fs");
const multer = require("multer")({
    dest: "public/files",
});


const path = require("path");

var beneficiariosRoutes = function () {
    var beneficiariosRouter = express.Router();

    //userRouter.use(middlewareAuth); //Require Token for all Routes on this Router

   beneficiariosRouter.route("/manager/").put(function (req, res) {
    let SQL = "UPDATE beneficiarios set isManager=0 Where idSuscriptor = '" + req.body.idSuscriptor + "'";

    sql
    .execute({
        query: SQL,
    })
    .then(
        function (results) {

            let SQL = "UPDATE beneficiarios set isManager=1 Where id = '" + req.body.id + "'";
            console.log(SQL);
            sql
                .execute({
                    query: SQL,
                })
                .then(
                    function (results2) {
        
        
                        res.json(
                        {
                            "status" : "ok",
                            "message": "manage asignado"})
        
                    },
                    function (err) {
                        console.log("Something bad happened:", err);
                    }
                );
 

        },
        function (err) {
            console.log("Something bad happened:", err);
        }
    );
});

   beneficiariosRouter.route("/asignado/:id").get(function (req, res) {
    let SQL = "SELECT sum(porcentaje)  asignado FROM beneficiarios Where idSuscriptor = '" + req.params.id + "'";
    console.log(SQL);
    sql
        .execute({
            query: SQL,
        })
        .then(
            function (results) {
                if (results.length > 0) {
                        res.json(
                            { "asignado" : results[0].asignado,
                            "porAsignar": 100 - results[0].asignado
                        }
                    );
                }else{
                    res.json({"status":"notFoud", "message":"No ha registrado nungún beneficiario"})
                }
            },
            function (err) {
                console.log("Something bad happened:", err);
            }
        );
});

beneficiariosRouter.get("/select/:id", function (req, res) {
    let sqlDelete = "select * from beneficiarios where id = " + req.params.id;
    sql.execute({query:sqlDelete})
    .then(function(resul){
        res.send(resul);
    },function(err){
        res.json({
            success: false,
            message: err,
        });
    })
    }) 

beneficiariosRouter.delete("/:id", function (req, res) {
let sqlDelete = "delete from beneficiarios where id = " + req.params.id;
sql.execute({query:sqlDelete})
.then(function(resul){
    res.json({
        success: true,
        message: "Succefull delete.",
    });
},function(err){
    res.json({
        success: false,
        message: err,
    });
})
})

beneficiariosRouter.put("/:idBeneficiario", function (req, res) {
    console.log(req.body);
    req.body.nombre

    let sqlstr = "UPDATE beneficiarios SET  " +
        "nombre     ='" + req.body.nombre + "'," +
        "apaterno   ='" + req.body.apellido + "'," +
        "fechaNac   ='" + req.body.fecnac + "'," +
        "email      ='" + req.body.correo + "'," +
        "telCasa    ='" + req.body.telCasa + "'," +
        "telMovil   ='" + req.body.telMovil + "'," +
        "porcentaje = '" + req.body.porcentaje + "' WHERE ID=" + req.params.idBeneficiario

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
}
);

    beneficiariosRouter.post("/", function (req, res) {
        console.log(req.body);
        req.body.nombre

        let sqlstr = "INSERT INTO beneficiarios(idSuscriptor, nombre,apaterno,fechaNac,email,telCasa,telMovil, porcentaje) " +
            "values(" +
            req.body.idGenerico + "," +
            "'" + req.body.nombre + "'," +
            "'" + req.body.apellido + "'," +
            "'" + req.body.fecnac + "'," +
            "'" + req.body.correo + "'," +
            "'" + req.body.telCasa + "'," +
            "'" + req.body.telMovil + "'," +
            "'" + req.body.porcentaje + "')"

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


    // GET: /api/users/
    beneficiariosRouter.route("/:id").get(function (req, res) {
        let SQL = "SELECT * FROM beneficiarios Where idSuscriptor = '" + req.params.id + "'";
        console.log(SQL);
        sql
            .execute({
                query: SQL,
            })
            .then(
                function (results) {
                    if (results.length > 0) {
                        console.log(results)
                        res.json( {"status":"ok","data":results});
                    }else{
                    	res.json({"status":"notFoud", "message":"No ha registrado nungún beneficiario"})
                    }
                },
                function (err) {
                    console.log("Something bad happened:", err);
                }
            );
    });

    // GET: /api/users/
    beneficiariosRouter.route("/:id/porctotal").get(function (req, res) {
        let SQL = "SELECT sum(porcentaje) as porcTotal FROM beneficiarios Where idSuscriptor = '" + req.params.id + "'";
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
    return beneficiariosRouter;
};

module.exports = beneficiariosRoutes;
