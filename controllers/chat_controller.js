var models = require('../models');
var Sequelize = require('sequelize');
var paginate = require('../helpers/paginate').paginate;
var cloudinary = require('cloudinary');
var io = require('socket.io');
var client = require('socket.io-client')
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
    //client.connect("http://localhost:4000");
    //console.log("Funciona el client")
	var user = req.user.dataValues;
	//console.log(user);
    res.render("chat/index", {user: user});
}

// POST /chat/:userId
exports.post = function (req, res, next) {
    var msg = req.body.msg;
    var user = req.body.user;
    console.log("Mensaje:" + msg);
    console.log("Usuario:" + user);

    client.connect("http://localhost:4000");
    console.log("Funciona el client")
    //console.log(user);
    //res.render("chat/index", {user: user});
}