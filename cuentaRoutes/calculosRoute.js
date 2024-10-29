var express = require('express'),
//middlewareAuth = require('../app/middleware'),
sql = require('../app/database');

var calculosRoutes = function(){

    var calculosRouter = express.Router();

    calculosRouter.route('/initial/:Id_suscriber').get(function(req,res){
            let montoInicial=0;
            strQuery = "select  cuenta.id_cuenta,monto from Cuenta inner join Rendim on Cuenta.id_cuenta= Rendim.id_cuenta where Id_suscriber="
            + req.params.Id_suscriber +" group by cuenta.id_cuenta, monto";
            console.log(strQuery)
            sql.execute({  
                query: strQuery
               
            }).then( function( results ) {

                if(results.length > 0){
                    for(var atr in results){
                        montoInicial = montoInicial + results[atr].monto ;
                            console.log(montoInicial);
                        }
                        let r = {"TotalInicial":montoInicial, "monto":results[atr].monto }
                            res.json(r);
                    } else {
                        res.send({
                            status:false,
                            message:"Not found"
                          });
                    }
             
            }, function( err ) {
                console.log( "Something bad happened:", err );
            });
    });

    calculosRouter.route('/current/:Id_suscriber').get(function(req,res){
	    let montoActual=0;
            strQuery = "SELECT cuenta.id_cuenta, MAX(Rendim.Ren_USD) monto " +
		"from Cuenta inner join Rendim " +
		"on Cuenta.id_cuenta= Rendim.id_cuenta " +
		"where Id_suscriber= " + req.params.Id_suscriber +
		" GROUP BY cuenta.id_cuenta " +
		"ORDER BY cuenta.id_cuenta;"
            console.log(strQuery)
            sql.execute({  
                query: strQuery
               
            }).then( function( results ) {

                let retiros=0;
                sql.execute({
                    query: "select sum(Ret_USD) retiros from Retiros where id_Suscriber="+req.params.Id_suscriber 
                }).then( function( sql_retiros ) {
                    retiros = sql_retiros[0]["retiros"]
                    if(results.length > 0){
                        for(var atr in results){
                            montoActual = montoActual + results[atr].monto;
                        console.log(montoActual);
                    }
                    let r = {"MontoActual":montoActual-retiros, "monto":results[atr].monto, "retiros":retiros}
                                res.json(r);
                        } else {
                            res.send({
                                status:false,
                                message:"Not found"
                              });
                        } 
                })
                
             
            }, function( err ) {
                console.log( "Something bad happened:", err );
            });
    });
    
    calculosRouter.route('/count/:Id_suscriber').get(function(req,res){
            strQuery = "select count( distinct cuenta.id_cuenta) Cuentas from cuenta where Id_suscriber= " + req.params.Id_suscriber ;
            console.log(strQuery)
            sql.execute({  
                query: strQuery
               
            }).then( function( results ) {
                if(results.length > 0){
                    res.json(results);
                } else {
                    res.send({
                        status:false,
                        message:"Not found"
                      });
                }              
            }, function( err ) {
                console.log( "Something bad happened:", err );
            });
    });
    return calculosRouter;
}

module.exports = calculosRoutes;
