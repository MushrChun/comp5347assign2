/**
 * Created by MushrChun on 12/5/17.
 */
var fs = require('fs');
var Revision = require('../models/revision');
var adminFile = fs.readFileSync('../admin.txt', 'utf8');
var admin = new Array();
adminFile.split("\n").forEach((item)=>{
    admin.push(item.trim());
});


var botFile = fs.readFileSync('../bot.txt', 'utf8');
var bot = new Array()
botFile.split("\n").forEach((item)=>{
    bot.push(item.trim());
});

function hasAnon(item){
    // console.log('anon'+item['anon'])
    if(item['anon']==undefined)
        return false;
    else{
        return true;
    }
}

function checkBot(item){
    var count = 0;
    // console.log('in check admin'+item)
    bot.forEach((bot_item) => {
        if(bot_item == item){
            count ++;
        }
        // console.log(bot_item)
    });
    // console.log(count);
    if(count > 0){
        return true;
    }else{
        return false;
    }
}

function checkAdmin(item){
    var count = 0;
    // console.log('in check admin'+item)
    admin.forEach((admin_item) => {
        if(admin_item == item){
            count ++;
        }
        // console.log(admin_item)
    });
    // console.log(count);
    if(count > 0){
        return true;
    }else{
        return false;
    }
}

fs.readdir('../revisions', function(err, items) {

    for (var i=90; i<items.length; i++) {
        var json = JSON.parse(fs.readFileSync('../revisions/'+items[i], 'utf8'));
        // console.log(json);
        json.forEach(function(entry){

            if(hasAnon(entry)){
                entry.type ='anonymous';
            }else if(checkAdmin(entry.user)){
                entry.type ='administrator';
            }else if(checkBot(entry.user)){
                entry.type ='bot';
            }else{
                entry.type ='user';
            }
            // console.log(entry)
            // Revision.collection.insert(entry)
            entry.timestamp = new Date(entry.timestamp);
            delete(entry.sha1);
            delete(entry.parsedcomment);
            delete(entry.revid);
            delete(entry.parentid);
            delete(entry.size);
            delete(entry.minor);
        });
        // console.log(json)
        Revision.collection.insertMany(json, function(err, docs){
            if(err){
                console.log(err);
            }
        });

    }
});

// var obj = JSON.parse