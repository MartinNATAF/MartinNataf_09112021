const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique:true, }
});

// uniqueValidator est un paquage pour mieux détaillé les erreurs qui remontrons à notre api en
//cas de problème.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);