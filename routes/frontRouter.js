var express = require('express'),
//middlewareAuth = require('../app/middleware'),
sql = require('../app/database');

var frontRoutes = function() {

    var frontRouter = express.Router();

     // GET: /api/front
     frontRouter.route('/:lang/:tag_module')
         .get(function(req,res) {
            strQuery = "SELECT Posicion" +
                            ",Titulo" +
                            ",Descripcion" +
                            ",ImgPath" +
                            ",ToolTip" +
                            ",Url " +
                        "FROM SmartBD.dbo.Contenidos " +
                        "WHERE Id_Idioma = '" +  req.params.lang +  "' " +
                        "AND Id_SubSeccion = " + req.params.tag_module + " " +
                        "ORDER BY Posicion "
            console.log(strQuery)
            sql.execute({  
            query: strQuery
           
        }).then( function( results ) {
            if(results.length > 0){
                res.json(results);
            } else {
                res.send("No reference Found");
            }              
        }, function( err ) {
            console.log( "Something bad happened:", err );
        });
    });
    return frontRouter;
}

module.exports = frontRoutes;