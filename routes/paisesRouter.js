var express = require('express'),
//middlewareAuth = require('../app/middleware'),
sql = require('../app/database');

var paisRoutes = function(){

    var paisRouter = express.Router();

    // GET: /api/users
    paisRouter.route('/')
        .get(function(req,res){
            strQuery = "SELECT PaisCodigo, PaisNombre FROM pais order by PaisNombre";
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

    return paisRouter;
}

module.exports = paisRoutes;
