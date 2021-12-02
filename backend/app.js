const express = require('express'); 

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');

const expressSanitizer = require('express-sanitizer');

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

// on ce connecte à notre serveur.
mongoose.connect('mongodb+srv://martin:pizzeria1@cluster0.wbcgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());

//on utilise un plugin de sécurité pour éviter toute intrusion malveillante et vérifier que la requète
//ne comporte pas de XSS attaque.
app.use(expressSanitizer());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;