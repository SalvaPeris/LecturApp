const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth');
const File = require('../models/File');
var formidable = require('formidable');
const fs = require('fs');
const { userInfo } = require('os');


router.get('/read/:name', isAuthenticated, async(req,res)=> {
    const epub = '/uploads/' + req.user.id + '/' + req.params.name;
    res.render('epub/reader', { epub });
});

module.exports = router;