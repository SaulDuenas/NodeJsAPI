var sql = require('seriate');
/*
    "server": "localhost",
    "user": "sa",
    "password": "Azulvioleta1",
    "database": "sbcvo"*/

/*     var dbConnect = {  
        "server": "movildpruebas.com.mx",
        "user": "Bds",
        "password": "Nescafe280$",
        "database": "CONFIG"
        }; */
/*         var dbConnect = {  
            "server": "3.214.179.251",
            "user": "userbaseaws",
            "password": "7X8@8c*;cg4uK6Pg{r",
            "database": "SmartBD"
            }; */
var connectDatabase = function(){
    var dbConnect = {  
             "server": "3.214.179.251",
            "user": "userbaseaws",
            "password": "7X8@8c*;cg4uK6Pg{r",
            "database": "SmartBD"
        };
    sql.setDefaultConfig( dbConnect );
    return sql;
}

module.exports = connectDatabase();
