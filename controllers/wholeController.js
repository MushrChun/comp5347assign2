/**
 * Created by MushrChun on 11/5/17.
 */
Revision = require('../models/revision');

module.exports.findMostRevisedArticle = function findMostRevisedArticle(req, res){
    Revision.findMostRevisedArticle(function(result){
        res.json({
            title: result[0]._id,
            count: result[0].numOfRevisions
        })
    })
};

module.exports.findLeastRevisedArticle = function findLeastRevisedArticle(req, res){
    Revision.findLeastRevisedArticle(function(result){
        res.json({
            title: result[0]._id,
            count: result[0].numOfRevisions
        })
    })
};

module.exports.findMostPopularArticle = function findMostPopularArticle(req, res){
    Revision.findMostPopularArticle(function(result){
        res.json({
            title: result[0]._id.title,
            count: result[0].count
        })
    })
};

module.exports.findLeastPopularArticle = function findLeastPopularArticle(req, res){
    Revision.findLeastPopularArticle(function(result){
        res.json({
            title: result[0]._id.title,
            count: result[0].count
        })
    })
};

module.exports.findLongestHistoryArticle = function findLongestHistoryArticle(req, res){
    Revision.findLongestHistoryArticle(function(result){
        res.json(result)
    })
};

module.exports.findLeastHistoryArticle = function findLeastHistoryArticle(req, res){
    Revision.findLeastHistoryArticle(function(result){
        res.json(result)
    })
};

module.exports.statRevByYearByType = function statRevByYearByType(req, res){
    Revision.statRevByYearByType(function(result){
        res.json(result)
    })
};

module.exports.statRevByType = function statRevByType(req, res){
    Revision.statRevByType(function(result){
        res.json(result)
    })
};

