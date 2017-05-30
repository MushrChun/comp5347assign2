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

module.exports.statTop5RegUsersRevisedArticle = function statTop5RegUsersRevisedArticle(req, res){

    async.waterfall([
        function(callback){
            Revision.findTop5RegUsersRevisedArticle(req.params.article, function(result){
                callback(null, result);
            })
        },
        function(result, callback){
            var list = new Array();
            var count = 0;

            async.whilst(
                function(){
                    if(count<result.length){
                        return true;
                    }else{
                        return false;
                    }
                },
                function(cb){
                    Revision.statRevByYearByUserOfArticle(result[count].user, req.params.article, function(data){

                        var userName = result[count].user;
                        data.forEach(function(entry){

                            list.push({
                                name: userName,
                                year: entry.year,
                                count: entry.count
                            })
                        });
                        cb(null, ++count);
                    })
                },
                function(err, n){
                    if(err){
                        console.log(err);
                    }
                    callback(null, list);
                }
            );
        },
        function(list){
            var yearSet = new Set();
            var nameSet = new Set();
            for(var i in list){
                yearSet.add(list[i].year);
                nameSet.add(list[i].name);
            }
            var yearList = Array.from(yearSet);
            for(var i in yearList){
                var currentYear = yearList[i];
                var loopNameSet = new Set();
                for(var j in list){
                    if(list[j].year == currentYear){
                        loopNameSet.add(list[j].name);
                    }
                }
                nameSet.forEach(function(entry){
                    if(!loopNameSet.has(entry)){
                        list.push({
                            name: entry,
                            year: currentYear,
                            count: 0
                        })
                    }
                });
            }
            var sorted = list.sort(function(a,b){
                return a.year - b.year;
            });

            console.log(sorted)
            console.log(nameSet)
            var dataSet = [];
            var nameList = Array.from(nameSet)
            for(var n in nameList){
                console.log(nameList[n]);
                var obj = [];
                for(var s in sorted){
                    console.log(sorted[s])
                    if(nameList[n] == sorted[s].name){
                        obj.push(sorted[s].count);
                    }
                }
                dataSet.push({
                    name: nameList[n],
                    data: obj
                })
            }

            res.json({
                yearList: yearList,
                dataSet: dataSet
            });

        }
    ]);

};
