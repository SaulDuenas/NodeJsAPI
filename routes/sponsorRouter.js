var express = require('express'),
//middlewareAuth = require('../app/middleware'),
sql = require('../app/database');

var sponsorRoutes = function(){

    var sponsorRouter = express.Router();

    // GET: /api/sponsor
    sponsorRouter.route('/:id')
        .get(function(req,res){
            strQuery = "SELECT * FROM users where IDSUSCRIBER =" + req.params.id + " ";
            console.log(strQuery)
            sql.execute({  
                query: strQuery
               
            }).then( function( results ) {
                if(results.length > 0){
                    res.json(results);
                } else {
                    res.send("No sponsors Found");
                }              
            }, function( err ) {
                console.log( "Something bad happened:", err );
            });
        });

    return sponsorRouter;
}

module.exports = sponsorRoutes;
