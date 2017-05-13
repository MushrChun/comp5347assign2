/**
 * Created by MushrChun on 11/5/17.
 */
Revision = require('../models/revision');

module.exports.fun1 = function fun1(req, res){
    Revision.distinct('user', {'anon':{'$exists':false},'title':'CNN'}, function(err,users){
        if (err){
            console.log("Query error!")
        }else{
            console.log("There are " + users.length + " distinct users in CNN");
        }
    })
};
