const Thing = require('../models/thing');

const fs = require('fs');

exports.createSauce = (req, res, next) => {
  // on récupère les données de la requète et on le met en format JSON réutilisable 
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  
  // on récupère l'ensemble des propriété de notre objet que l'on va filtrer et analiser.
  // de manière a empècher une attaque malveillante ou toute requète inadapté pour plus de sécurité
  const sauceSanitized = {
    name: req.sanitize(sauceObject.name),
    manufacturer: req.sanitize(sauceObject.manufacturer),
    description: req.sanitize(sauceObject.description),
    mainPepper: req.sanitize(sauceObject.mainPepper)
  }

  const sauce = new Thing({
    ...sauceSanitized,
    userId: sauceObject.userId,
    heat: sauceObject.heat,
    // on obtient : http ou https puis host puis le répertoire puis le nom du fichier.
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  // on enregistre la sauce dans notre base de donnés
  sauce.save()
    .then(() => res.status(201).json({ message: 'La nouvelle sauce a été enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

// on cherche un objet avec l'id que l'on a récupérer dans la requète.
exports.getOneSauce = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

//on cherche juste à la route standard ou l'ensemble des objets sont stockés.
exports.getAllSauces = (req, res, next) => {
	Thing.find()
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};


exports.modifySauce = (req, res, next) => {
  let sauceObject
  let sauceSanitized
  let sauceModifiedObject

  // on récupère la nouvelle image
  if (req.file) {
    Thing.findOne({ _id: req.params.id })
    .then(thing => {
        // on récupère le nom du fichier image
        const filename = thing.imageUrl.split('/images/')[1];
        
        // on supprime l'ancienne image
        fs.unlink(`images/${filename}`, function (error) {
          if (error) throw error;
        });
    })
    .catch(error => res.status(500).json({ error }));

    // on met l'ensemble des info de la requète dans un objet JSON
    sauceObject = JSON.parse(req.body.sauce);

    // on analyse tous
    sauceSanitized = {
      name: req.sanitize(sauceObject.name),
      manufacturer: req.sanitize(sauceObject.manufacturer),
      description: req.sanitize(sauceObject.description),
      mainPepper: req.sanitize(sauceObject.mainPepper)
    }

    // on ajoute l'image et les diffrérentes info de notre objet dans notre futur nouvel objet
    sauceModifiedObject = {
      ...sauceSanitized,
      heat: sauceObject.heat,
      userId: sauceObject.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  } else {
    // on récupère les informations contenue dans la requête
    sauceObject = req.body;

    // on analise ce qui est dans la requète (voir + haut)
    sauceSanitized = {
      name: req.sanitize(sauceObject.name),
      manufacturer: req.sanitize(sauceObject.manufacturer),
      description: req.sanitize(sauceObject.description),
      mainPepper: req.sanitize(sauceObject.mainPepper)
    }

    // L'objet est construit
    sauceModifiedObject = {
      ...sauceSanitized,
      heat: sauceObject.heat,
      userId: sauceObject.userId
    }
  }
 
  Thing.updateOne({ _id: req.params.id }, { ...sauceModifiedObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'La sauce a été modifié !' }))
  .catch(error => res.status(400).json({ error }));
};

//on vérifie que l'utilisateur est bien celui qui a créer la sauce puis on la supprime
exports.deleteSauce = (req, res, next) => {
	Thing.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce supprimée'}))
		.catch(error => res.status(400).json({ error }));
};

exports.likeOneSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;

  // on vérifie si l'utilisateur a déjà noté la sauce
  if (like === 0) {
    Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      // on retire le like
      if (thing.usersLiked.find(user => user === userId)) {
        Thing.updateOne({ _id: req.params.id }, {
          $inc: { likes: -1 },
          $pull: { usersLiked: userId },
          _id: req.params.id
        })

      .then(() => res.status(200).json({ message: 'le like a été enlevé' }))
      .catch(error => res.status(400).json({ error }));
      }

      // on retire le dislike
      if (thing.usersDisliked.find(user => user === userId)) {
        Thing.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: userId },
          _id: req.params.id
        })

      .then(() => res.status(200).json({ message: 'le dislike a été enlevé' }))
      .catch(error => res.status(400).json({ error }));
      }
    })

    .catch(error => res.status(500).json({ error }));

  // on vérifie si l'utilisateur like la sauce
  } else if (like === 1) {
    Thing.updateOne({ _id: req.params.id }, {
      $inc: { likes: 1 },
      $push: { usersLiked: userId },
      _id: req.params.id
    })

    .then(() => res.status(200).json({ message: 'le like a été ajouté' }))
    .catch(error => res.status(400).json({ error }));

  // on vérifie si l'utilisateur dislike la sauce
  } else if (like === -1) {
    Thing.updateOne({ _id: req.params.id }, {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: userId },
      _id: req.params.id
    })

    .then(() => res.status(200).json({ message: 'le dislike a été ajouté' }))
    .catch(error => res.status(400).json({ error }));
  };
};