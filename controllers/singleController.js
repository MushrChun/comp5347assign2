/**
 * Created by MushrChun on 11/5/17.
 */
Revision = require('../models/revision');
https = require('https');
async = require('async');

var batchComplete = false;
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
            rvCount = 0;
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
                console.log(revisions)
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
                return 0;
            }
        });

    });
}

// checkAndUpdate('Australia',  function(result){
//     console.log(result)
// })

module.exports.statTotalRevisionOfArticle = function statTotalRevisionOfArticle(req, res){

    async.series([
        function(callback) {
            checkAndUpdate(req.params.article, function(result){
                callback(null, result);
            })
        },
        function(callback){
            Revision.statTotalRevisionOfArticle(req.params.article, function(result){
                callback(null, result);
            })
        }
    ],
        function(err, results){
            if(err){
                return console.log(err);
            }
            res.json({
                updateCount: results[0],
                result: results[1]
            });

        }
    );

};

module.exports.findTop5RegUsersRevisedArticle = function findTop5RegUsersRevisedArticle(req, res){

    async.series([
            function(callback) {
                checkAndUpdate(req.params.article, function(result){
                    callback(null, result);
                })
            },
            function(callback){
                Revision.findTop5RegUsersRevisedArticle(req.params.article, function(result){
                    callback(null, result);
                })
            }
        ],
        function(err, results){
            if(err){
                return console.log(err);
            }
            res.json({
                updateCount: results[0],
                result: results[1]
            });

        }
    );
};

module.exports.statRevByYearByTypeOfArticle = function statRevByYearByTypeOfArticle(req, res){

    async.series([
            function(callback) {
                checkAndUpdate(req.params.article, function(result){
                    callback(null, result);
                })
            },
            function(callback){
                Revision.statRevByYearByTypeOfArticle(req.params.article, function(result){
                    callback(null, result);
                })
            }
        ],
        function(err, results){
            if(err){
                return console.log(err);
            }
            res.json({
                updateCount: results[0],
                result: results[1]
            });

        }
    );
};

module.exports.statRevByTypeOfArticle = function statRevByTypeOfArticle(req, res){

    async.series([
            function(callback) {
                checkAndUpdate(req.params.article, function(result){
                    callback(null, result);
                })
            },
            function(callback){
                Revision.statRevByTypeOfArticle(req.params.article, function(result){
                    callback(null, result);
                })
            }
        ],
        function(err, results){
            if(err){
                return console.log(err);
            }
            res.json({
                updateCount: results[0],
                result: results[1]
            });

        }
    );
};

module.exports.statRevByYearByUserOfArticle = function statRevByYearByUserOfArticle(req, res){

    async.series([
            function(callback) {
                checkAndUpdate(req.params.article, function(result){
                    callback(null, result);
                })
            },
            function(callback){
                Revision.statRevByYearByUserOfArticle(req.params.article, function(result){
                    callback(null, result);
                })
            }
        ],
        function(err, results){
            if(err){
                return console.log(err);
            }
            res.json({
                updateCount: results[0],
                result: results[1]
            });

        }
    );
};

