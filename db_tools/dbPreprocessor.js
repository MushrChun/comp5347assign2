/**
 * Created by MushrChun on 11/5/17.
 */
var Revision = require('../models/revision');
var mongoose = require('mongoose');
var mongodb = require('mongodb')
var fs = require('fs');
var async = require('async');

var adminData = fs.readFileSync('../admin.txt', 'utf8');
var admin = new Array();
adminData.split("\n").forEach((item)=>{
    admin.push(item.trim());
});
// console.log(admin);


var botData = fs.readFileSync('../bot.txt', 'utf8');
var bot = new Array()
botData.split("\n").forEach((item)=>{
    bot.push(item.trim());
});
// console.log(bot);

function hasAnon(item){
    // console.log('anon'+item['anon'])
    if(item['anon']==undefined)
        return false;
    else{
        return true;
    }
}

// admin.forEach((admin_item)=>{
//     console.log(admin_item)
// })

// bot.forEach((bot_item)=>{
//     console.log(typeof(bot_item))
// })

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

function fixItem(mOffset, mLimit){
    Revision.find({}).skip(mOffset).limit(mLimit).exec(function(err, result){
        if(err) {
            console.log(err);
            return;
        }
        // console.log(result)
        result.forEach(function(item){
            // console.log(item)
            // console.log(item._id+":")
            if(hasAnon(item)){
                item.type ='anonymous';
            }else if(checkAdmin(item.user)){
                item.type ='administrator';
            }else if(checkBot(item.user)){
                item.type ='bot';
            }else{
                item.type ='user';
            }
            item.save(function(err) {
                if(err) {
                    console.error('ERROR! in save');
                }
            });
            console.log("-----" +item._id+  "-----"+ item.type +"-------------")
        });

    });
}

for (var i = 0; i< 560; i++){
    fixItem(i * 100, 100);
}
// fixItem(0, 10)

// mongodb.collection('revisions').find().forEach(function(item){
//
//         console.log(item)
//         console.log(item._id+":")
//         if(hasAnon(item)){
//             item.type ='anonymous';
//         }else if(checkAdmin(item.user)){
//             item.type ='administrator';
//         }else if(checkBot(item.user)){
//             item.type ='bot';
//         }else{
//             item.type ='user';
//         }
//         item.save(function(err) {
//             if(err) {
//                 console.error('ERROR!');
//             }
//         });
//         console.log("------------"+ item.type +"-------------")
//
// });
