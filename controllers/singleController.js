/**
 * Created by MushrChun on 11/5/17.
 */
Revision = require('../models/revision');

module.exports.statTotalRevisionOfArticle = function statTotalRevisionOfArticle(req, res){
    Revision.statTotalRevisionOfArticle(req.params.article, function(result){
        res.json(result)
    })
};

module.exports.findTop5RegUsersRevisedArticle = function findTop5RegUsersRevisedArticle(req, res){
    Revision.findTop5RegUsersRevisedArticle(req.params.article, function(result){
        res.json(result)
    })
};

module.exports.statRevByYearByTypeOfArticle = function statRevByYearByTypeOfArticle(req, res){
    Revision.statRevByYearByTypeOfArticle(req.params.article, function(result){
        res.json(result)
    })
};

module.exports.statRevByTypeOfArticle = function statRevByTypeOfArticle(req, res){
    Revision.statRevByTypeOfArticle(req.params.article, function(result){
        res.json(result)
    })
};

module.exports.statRevByYearByUserOfArticle = function statRevByYearByUserOfArticle(req, res){
    Revision.statRevByYearByUserOfArticle(req.params.user, req.params.article, function(result){
        res.json(result)
    })
};

