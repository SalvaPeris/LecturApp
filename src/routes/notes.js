const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req,res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async(req,res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({text: 'Por favor, escribe un título.'})
    }

    if (!description) {
        errors.push({text: 'Por favor, escribe una descripción.'})
    }

    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        req.flash('success_msg', 'Nota agregada correctamente');
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save(); 
        res.redirect('/notes');
    }
    
});

router.get('/notes', isAuthenticated, async(req,res)=> {
    const notes = await Note.find({user: req.user.id}).lean().sort({date:'desc'});
    res.render('notes/all-notes', { notes });
});

router.get('/notes/find', async(req,res)=> {
    res.render('notes/find-shared-note');
});

router.get('/notes/sharing', async(req,res)=> {
    const notes = await Note.find({user: req.user.id}).lean().sort({date:'desc'});
    res.render('notes/all-sharing-notes', { notes });
});

router.post('/notes/find', async(req,res)=> {
    const { noteid } = req.body;
    const notes = await Note.find({_id: noteid}).lean();
    console.log(noteid);
    res.render('notes/shared-notes', { notes });
});


router.get('/notes/edit/:id', isAuthenticated, async(req,res)=> {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note})
});

router.put('/notes/edit-note/:id', isAuthenticated, async(req,res)=> {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description }).lean();
    req.flash('success_msg', 'Nota actualizada correctamente.');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async(req,res)=> {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Nota eliminada correctamente');
    res.redirect('/notes')
});


module.exports = router;