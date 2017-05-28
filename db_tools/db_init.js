/**
 * Created by MushrChun on 12/5/17.
 */
var fs = require('fs');
var async = require('async');
var Revision = require('../models/revision');
var checkTool = require('../tools/tools');


fs.readdir('revisions', function(err, items) {

    var i = 0;
    async.whilst(
        function(){
            return i < items.length;
        },
        function(callback){
            console.log('in loop ' + i + ' :' +items[i]);

            var json = JSON.parse(fs.readFileSync('revisions/'+items[i], 'utf8'));
            json.forEach(function(entry){

                if(checkTool.hasAnon(entry)){
                    entry.type ='anonymous';
                }else if(checkTool.checkAdmin(entry.user)){
                    entry.type ='administrator';
                }else if(checkTool.checkBot(entry.user)){
                    entry.type ='bot';
                }else{
                    entry.type ='user';
                }
                entry.timestamp = new Date(entry.timestamp);
                delete(entry.sha1);
                delete(entry.parsedcomment);
                delete(entry.revid);
                delete(entry.parentid);
                delete(entry.size);
                delete(entry.minor);
            });
            Revision.collection.insertMany(json, function(err, docs){
                if(err){
                    console.log(err);
                }else{
                    console.log('finish loop ' + i + ' :' +items[i]);
                    callback(null, i++);
                }
            });
        },
        function(err, n){
            if(err){
                console.log(err);
            }else{
                console.log('finish as ' + n);
            }
        }

    );
});
