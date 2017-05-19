/**
 * Created by MushrChun on 11/5/17.
 */
Revision = require('../models/revision');
https = require('https');
async = require('async');

var batchComplete;
var rvcontinue;
var rvCount;

function checkAndUpdate(title, callback){
    Revision.findTitleLatestRev(title, function(err, result){
        if(err){
            console.log(err)
            return
        }

        var lastDate = new Date(result[0].timestamp)
        var now = new Date()
        var diffDay = parseInt((now - lastDate)/(24*3600*1000))
        if(diffDay>=1){
            console.log('to update');
            rvCount = 0;
            batchComplete = false;
            rvcontinue = undefined;
            lastDate.setSeconds(lastDate.getSeconds()+1); //skip last revision
            async.whilst(
                function() {
                    return !batchComplete;
                },
                function(cb) {
                    tryToImportNewRevisons(title, lastDate, cb);
                },
                function(err, n) {
                    callback(n);
                })
        }else{
            callback(0)
        }
    })
}

function tryToImportNewRevisons(title, startDate, cb){

    var pathStr = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=' +title+ '&rvprop=timestamp%7Cuser&rvlimit=max&rvend='+ startDate.toISOString()+'&format=json';
    // var pathStr = 'http://www.google.com.au'
    if(rvcontinue){
        pathStr += '&rvcontinue=' + rvcontinue;
    }

    console.log(pathStr);
    https.get(pathStr, function(res) {
        var status = res.statusCode;
        var rawData = '';
        res.on('data', function(chunk) { rawData += chunk; });
        res.on('end', function() {
            try {
                // console.log('rawData:'+rawData)
                var parsedData = JSON.parse(rawData);
                var batchCompleteIndicator = parsedData.batchcomplete;
                if(batchCompleteIndicator == undefined){
                    batchComplete = false;
                    rvcontinue = parsedData.continue.rvcontinue;
                }else{
                    batchComplete = true;
                }
                var pages = parsedData.query.pages;
                var revisions = pages[Object.keys(pages)].revisions;
                var checkTool = require('../tools/tools');
                if(revisions == undefined){
                    return cb(null, 0);
                }
                revisions.forEach(function(revision){
                    if(checkTool.hasAnon(revision)){
                        revision.type ='anonymous';
                    }else if(checkTool.checkAdmin(revision.user)){
                        revision.type ='administrator';
                    }else if(checkTool.checkBot(revision.user)){
                        revision.type ='bot';
                    }else{
                        revision.type ='user';
                    }
                    revision.title = title;
                    var tmp = new Revision(revision);
                    rvCount ++;
                    tmp.save();
                });
                cb(null, revisions.length);
            } catch (e) {
                console.error(e.message);
            }
        });

    });
}


module.exports.updateArticle = function updateArticle(req, res){

    checkAndUpdate(req.params.article, function(result){
        res.json({
            updated: result,
            title: req.params.article
        });
    })

};

module.exports.statTotalRevisionOfArticle = function statTotalRevisionOfArticle(req, res){

    Revision.statTotalRevisionOfArticle(req.params.article, function(result){
        res.json({
            count: result
        });
    })

};

module.exports.findTop5RegUsersRevisedArticle = function findTop5RegUsersRevisedArticle(req, res){

    Revision.findTop5RegUsersRevisedArticle(req.params.article, function(result){
        res.json(result);
    })
};

module.exports.statRevByYearByTypeOfArticle = function statRevByYearByTypeOfArticle(req, res){

    Revision.statRevByYearByTypeOfArticle(req.params.article, function(result){
        res.json(result);
    })
};

module.exports.statRevByTypeOfArticle = function statRevByTypeOfArticle(req, res){

    Revision.statRevByTypeOfArticle(req.params.article, function(result){
        res.json(result);
    })
};

module.exports.statRevByYearByUserOfArticle = function statRevByYearByUserOfArticle(req, res){

    Revision.statRevByYearByUserOfArticle(req.params.user, req.params.article, function(result){
        res.json(result);
    })
};

module.exports.findUsersOfArticle = function findUsersOfArticle(req, res){

    Revision.findUsersOfArticle(req.params.article, function(result){
        res.json(result);
    })
};

