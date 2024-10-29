var express = require('express'),
//middlewareAuth = require('../app/middleware'),
sql = require('../app/database');
const { read } = require('fs');

var orgRoutes = function(){

    var orgRouter = express.Router();

    // GET: /api/organization
    orgRouter.route('/:id_head')
        .get(function(req,res){
            strQuery = 
            "WITH DirectReports (ManagerID, EmployeeID) " +
            "AS " +
            "( " +
            "SELECT e.id_suscriber, e.id_frontal " +
            "FROM dbo.Frontales AS e " +
            "WHERE id_suscriber = " + req.params.id_head + " " +
            "UNION ALL " +
            "SELECT e.id_suscriber, e.id_frontal " +
            "FROM dbo.Frontales AS e " +
            "INNER JOIN DirectReports AS d " +
            "ON e.id_suscriber = d.EmployeeID " +
            ") " +
            "SELECT ManagerID 'from' , EmployeeID 'to' " +
            "FROM DirectReports ";
            console.log(strQuery)
            sql.execute({  
                query: strQuery
               
            }).then( function( results ) {
                if(results.length > 0){
                    //res.send(results)
                     var edges = {};
                    var key = 'edges';
                    edges[key] = [];

                    var nodes = {};
                    var keynodes = 'nodes';
                    nodes[keynodes] = [];

                    var json = {};
                    var jsonnodes = 'data';
                    json[jsonnodes] = [];

                    var socios = {};
                    var keysocios = 'socios';
                    socios[keysocios] = [];

                    let strIn=req.params.id_head;
                    for(var atr in results){
                        strIn = strIn + "," +results[atr].to
                        var data = {
                            from: results[atr].from,
                            to: results[atr].to
                        };
                        edges[key].push(data);
                    }
                    strGetUsers="select IDSUSCRIBER,'image' shape,avatar image,CONCAT(name, LASTNAME) label, name,lastname,slastname, email, telephone from users where IDSUSCRIBER in (" + strIn +")"

  
 

                        //strGetUsers = "SELECT users.name as nombre, users.LASTNAME as LASTNAME FROM users  WHERE users.ID ='"+ results[atr].id_frontal + "'";
                        sql.execute({  
                            query: strGetUsers
                           
                        }).then( function( results2 ) {
                            var lnodes = {};
                            var lkeynodes = 'nodes';
                            lnodes[lkeynodes] = [];

  
                            
                            results2.forEach(element => {
                                readImage = element["image"];
                            
                                readImage="../../assets/img/users/he.png";

                                var dataSocios = {
                                    nombre: element["name"],
                                    lastname: element["lastname"],
                                    slastname: element["slastname"],
                                    email: element["email"],
                                    telephone: element["telephone"],
                                };
                                socios[keysocios].push(dataSocios)            

                                var data = {
                                    id: element["IDSUSCRIBER"],
                                    shape: element["shape"],
                                    image: readImage,
                                    label: element["label"]
                                };
                                lnodes[lkeynodes].push(data)
                                
                            });
                            nodes = lnodes
                        }, function( err ) {
                            console.log( "Something bad happened:", err );
                        }).then(function(){
                            console.log(socios)
                            json[jsonnodes].push(nodes);
                            json[jsonnodes].push(edges);
                            json[jsonnodes].push(socios);
                            res.send(json); 
                        }); 

                } else {
                    res.send("No Users Found");
                }              
            }, function( err ) {
                console.log( "Something bad happened:", err );
            });
        });

    return orgRouter;
}

module.exports = orgRoutes;
