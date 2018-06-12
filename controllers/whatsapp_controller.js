var models = require('../models');
var Sequelize = require('sequelize');
var paginate = require('../helpers/paginate').paginate;
var cloudinary = require('cloudinary');
var moment = require('moment');
var app = require('../app');
var open = require('open-new-tab');


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

// POST /customers/:customerId/whatsapp
exports.customer = function (req, res, next) {
	
	var phone = req.customer.phone1;
	customer = req.customer;
	var body = JSON.stringify(req.body.name);
	var message = req.body.name[2];
	//var emailBody = req.body.name[2];
	console.log('');
	console.log('Numero: '+ phone);
	console.log('Mensaje: ' + message);
	console.log('');
	//window.location = 'whatsapp://send?text=Hola&phone='+phone;
	console.log('Llega??');
	req.flash('success', 'Whatsapp enviado al cliente '+ req.customer.name + ' con exito.');
	//open('https://api.whatsapp.com/send?phone=34'+phone+'&text='+message);
	res.redirect('https://api.whatsapp.com/send?phone=34'+phone+'&text='+message);
};


// POST /companies/:customerId/whatsapp
exports.company = function (req, res, next) {
	var phone = req.customer.phone1;
	customer = req.customer;
	var body = JSON.stringify(req.body.name);
	var emailSubject = req.body.name[1];
	var emailBody = req.body.name[2];
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	req.flash('success', 'Email enviado al cliente '+ req.customer.name + ' con exito.');
	res.redirect('/customers/' + customer.id);
};