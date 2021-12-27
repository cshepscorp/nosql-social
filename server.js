const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require('./routes')); // imports ./routes/index.js

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nosqlsocialdb', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
// a set of configuration options Mongoose asks for more information about.
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true); 

app.listen(PORT, () => console.log(`🌍 App running on port ${PORT}!`));
