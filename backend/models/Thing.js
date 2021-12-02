const mongoose = require('mongoose');

// shéma de notre objet comme l'a demandé le support thecnique du projet.
const thingSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number, default: 0, required: true },
	dislikes: { type: Number, default: 0, required: true },
	usersLiked: { type: Array, default: [], required: true },
	usersDisliked: { type: Array, default: [], required: true },
});

module.exports = mongoose.model('Thing', thingSchema);