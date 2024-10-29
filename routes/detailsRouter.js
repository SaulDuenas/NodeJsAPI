var express = require('express'),
//middlewareAuth = require('../app/middleware'),
sql = require('../app/database');

var frontRoutes = function() {

    var detailRouter = express.Router();
    // GET: /api/front
    detailRouter.route('/:lang/:code')
                .get(function(request,response) {
                    strQuery = "SELECT  A.Id_Idioma,A.Contenido " +
                               "FROM SmartBD.dbo.DetalleBase as A " +
                               "INNER JOIN SmartBD.dbo.ElementosBase as B ON (A.Id_Elemento = B.Id) " +
                               "WHERE B.codigo = @code " +
                               "AND A.Id_Idioma = @lang " +
                               "ORDER BY Posicion ASC"

                    console.log(strQuery);
                    sql.execute({ query: strQuery, 
                                  params: {
                                            code: {
                                                    val: request.params.code,
                                                    type: sql.VarChar
                                                  },
                                            lang: {
                                                    val: request.params.lang,
                                                    type: sql.VarChar
                                                  },      
                                          }
                                })
                       .then( function( results ) {
                                if(results.length > 0) {

                                    console.log( Object.getOwnPropertyNames(results).sort());

                                    console.log(results);
                                    response.status(201).json(results);
                                
                                } else {
                                    response.status(204).send("No reference Found");
                                }              
                              }, 
                              function( err ) {
                                console.log( "Something bad happened:", err );
                              }
                            );
                    });

    return detailRouter;
}

module.exports = frontRoutes;