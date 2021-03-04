const mongoose = require('mongoose');

/*mongoose.connect('mongodb://mongo/notes-db-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
 .then(db => console.log('DB is connected'))
 .catch(err => console.error(err));*/

mongoose.connect("mongodb://lecturadb:yHMJstzYOZg9dx9laDvhxm3yQTgQO1Ko204UrMk9OWuddggMMss1J8sQfLUmOh4ZWGZwW4KlTncdSbE64IGgIw==@lecturadb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@lecturadb@", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
 .then(db => console.log('DB is connected'))
 .catch(err => console.error(err));
