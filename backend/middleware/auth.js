const jwt = require('jsonwebtoken');


// le module auth est une sécuritée pour bien vérifié que chaque utilisateur à le droit
//de faire une quelquonque action.
// on récupère notre token qui est la première partie de notre headers quand on fait une requète
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //on utilise la fonction verify pour décoder notre tokenb et vérifier qu'il est valide.
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // nous extrayons l'ID utilisateur de notre token 
    //si la demande contient un ID utilisateur, nous le comparons à celui extrait du token.
    // S'ils sont différents, nous générons une erreur ;
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};