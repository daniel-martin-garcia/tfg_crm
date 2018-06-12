var models = require('../models');
var Sequelize = require('sequelize');
var paginate = require('../helpers/paginate').paginate;
var cloudinary = require('cloudinary');
var moment = require('moment');
var app = require('../app');
//var mailer = require('express-mailer');
var token = null; //Mirar como hacer token en privado


//-----------------------------------------------------------

// Autoload el cliente asociado a :customerId
exports.load = function (req, res, next, customerId) {

	models.Company.findById(
        companyId,
        {
            include: [
                {
                    model: models.Customer,
                    as: "AllCustomers",
                    attributes: ['id', 'code', 'name', 'email1']
                }
            ],
            order: [[{model: models.Customer, as: "AllCustomers"}, 'name']]
        }
    )
    .then(function (company) {
        if (company) {
            req.company = company;
            next();
        } else {
            throw new Error('No existe ninguna fábrica con Id=' + companyId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};

// POST /customers/:customerId
exports.customer = function (req, res, next) {
	
	var email = req.customer.email1;
	customer = req.customer;
	var body = JSON.stringify(req.body.name);
	var emailSubject = req.body.name[1];
	var emailBody = req.body.name[2];
	console.log('');
	console.log('');
	console.log('Email:' + email);
	console.log('');
	console.log('Asunto: ' + emailSubject);
	console.log('Cuerpo: ' + emailBody);
	console.log('');
	console.log('');
	var mailOptions = {
		to: email, //Cambiar por el address del customer i
		subject: emailSubject,
		user: {
			name: req.body.name[0],
			message: emailBody,
		}
	}
	
	res.mailer.send('email_body', mailOptions, function (err,message){
		if(err){
			console.log(err);
			res.send(err);
			return;
		}
	req.flash('success', 'Email enviado al cliente '+ req.customer.name + ' con exito.');
	res.redirect('/customers/' + customer.id);
	});
};


// GET /companies/:companyId/email
exports.company = function (req, res, next) {
	var companyCustomers = req.company.AllCustomers;
	var str = JSON.stringify(companyCustomers[1]);
	console.log('Numero de clientes: ' + companyCustomers.length);
	console.log('Nombre:' + str);
	console.log('');

	var emailSubject = req.body.name[1];
	var emailBody = req.body.name[2];
	for (var i = companyCustomers.length - 1; i >= 0; i--) {
		var mailOptions = {
			to: companyCustomers[i].email1, //Cambiar por el address del customer i
			subject: emailSubject,
			user: {
				name: req.body.name[0],
				message: emailBody,
			}
		}	
		res.mailer.send('email_body', mailOptions, function (err,message){
			if(err){
				console.log(err);
				res.send(err);
				return;
			}
		});
	}

	req.flash('success', 'Email enviado a los clientes de ' + req.company.name + ' con exito.');
    res.redirect('/companies/' + req.company.id);
};