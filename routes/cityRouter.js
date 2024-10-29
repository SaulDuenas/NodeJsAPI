var express = require('express'),
//middlewareAuth = require('../app/middleware'),
sql = require('../app/database');

var cityRoutes = function(){

    var cityRouter = express.Router();

    // GET: /api/users
    cityRouter.route('/:code')
        .get(function(req,res){
            strQuery = "SELECT * FROM ciudad WHERE PaisCodigo ='"+ req.params.code + "' order by CiudadNombre";
            console.log(strQuery)
            sql.execute({  
                query: strQuery
               
            }).then( function( results ) {
                if(results.length > 0){
                    res.json(results);
                } else {
                    res.send("No Users Found");
                }              
            }, function( err ) {
                console.log( "Something bad happened:", err );
            });
        });

    return cityRouter;
}

module.exports = cityRoutes;
