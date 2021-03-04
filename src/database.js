const mongoose = require('mongoose');

/*mongoose.connect('mongodb://mongo/notes-db-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
 .then(db => console.log('DB is connected'))
 .catch(err => console.error(err));*/

mongoose.connect("mongodb+srv://salva:salvadb@cluster0.nkpxr.mongodb.net/lecturadb?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
 .then(db => console.log('DB is connected'))
 .catch(err => console.error(err));
