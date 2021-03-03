const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth');
const File = require('../models/File');
var formidable = require('formidable');
const fs = require('fs');
const { userInfo } = require('os');


router.get('/files', isAuthenticated, async(req,res)=> {
    const files = await File.find({user: req.user.id}).lean().sort({date:'desc'});
    console.log(files);
    res.render('files/all-files', { files });
});

router.get('/files/copied', isAuthenticated, async(req,res)=> {
    req.flash('success_msg', 'Código copiado correctamente. Ahora podrás compartirlo con quien desee');
    res.redirect('/files');
});

router.get('/download/:name', isAuthenticated, async(req,res)=> {
    const file = __dirname + '/../public/uploads/' + req.user.id + '/'+ req.params.name;
    res.download(file);
});

router.get('/download/:user/:name', async(req,res)=> {
    const file = __dirname + '/../public/uploads/' + req.user.id + '/'+ req.params.name;
    console.log(file);
    req.flash('success_msg', 'Descargando...');
    res.download(file);
});

router.get('/delete/:name', isAuthenticated, async(req,res)=> {
    const file = __dirname + '/../public/uploads/' + req.user.id + '/'+ req.params.name;
    fs.unlinkSync(file);
    await File.findOneAndDelete({name: req.params.name, user: req.user.id}).lean();
    const files = await File.find({user: req.user.id}).lean().sort({date:'desc'});
    req.flash('success_msg', 'Archivo borrado correctamente.');
    res.redirect('/files');
});

router.post('/files/find', async(req,res)=> {
    const { fileid } = req.body;
    const files = await File.find({_id: fileid}).lean();
    res.render('files/shared-files', { files });
});

router.get('/sharing/:name', isAuthenticated, async(req,res)=> {
    const files = await File.findOne({name: req.params.name, user: req.user.id}).lean();
    console.log(files._id);
    res.render('files/all-sharing-files', { files });
});

router.post('/upload', isAuthenticated, (req,res)=> {
    var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, filesUp) {
            // oldpath : temporary folder to which file is saved to
            var oldpath = filesUp.filetoupload.path;
            const name = filesUp.filetoupload.name;
            const upload_path = __dirname + '/../public/uploads/' + req.user.id + '/';
            fs.existsSync(upload_path) || fs.mkdirSync(upload_path);
            var milliseconds = new Date().getTime();
            var newpath = upload_path + filesUp.filetoupload.name + milliseconds ;
            // copy the file to a new location
            console.log(name);
            fs.rename(oldpath, newpath, async function (err) {
                if (err) throw err;
                // you may respond with another html page
                const route = __dirname + '/../public/uploads/' + req.user.id + '/';
                const filesArray = [];
                fs.readdirSync(route).forEach(file =>  {
                    filesArray.push(file);
                });  
                const newFile = new File({name, route});
                newFile.user = req.user.id;
                await newFile.save(); 
                const files = await File.find({user: req.user.id}).lean().sort({date:'desc'});
                req.flash('success_msg', 'Archivo subido correctamente.');
                res.render('files/all-files', { files });
            });
        });
});


module.exports = router;