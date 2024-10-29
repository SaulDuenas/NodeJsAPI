var express = require('express'),
    //middlewareAuth = require('../app/middleware'),
    sql = require('../app/database');

var rendimientosRoutes = function () {

    var rendimientosRouter = express.Router();

    // GET: /api/cuenta
    rendimientosRouter.route('/')
        .get(function (req, res) {
            strQuery = "SELECT * FROM Rendim ";
            console.log(strQuery)
            sql.execute({
                query: strQuery

            }).then(function (results) {
                if (results.length > 0) {
                    res.json(results);
                } else {
                    res.send({
                        status:false,
                        message:"Not found"
                      });
                }
            }, function (err) {
                console.log("Something bad happened:", err);
            });
        });

    return rendimientosRouter;
}

module.exports = rendimientosRoutes;