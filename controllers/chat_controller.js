var models = require('../models');
var Sequelize = require('sequelize');
var paginate = require('../helpers/paginate').paginate;
var cloudinary = require('cloudinary');
var io = require('socket.io');
var openStack = require('socket.io-client');
var moment = require('moment');

var socket = openStack('http://localhost:8000');

//-----------------------------------------------------------


// Autoload el user asociado a :userId
exports.load = function (req, res, next, userId) {
    models.User.findById(userId,
        {
            include: [
                {model: models.Attachment, as: 'Photo'}
            ],
            order: [['login']]
        })
    .then(function (user) {
        if (user) {
            req.user = user;
            next();
        } else {
            req.flash('error', 'No existe el usuario con id=' + userId + '.');
            throw new Error('No existe userId=' + userId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /chat/:userId
exports.index = function (req, res, next) {
	var user = req.user.dataValues;
	console.log(user);
    res.render("chat/index", {user: user});
}