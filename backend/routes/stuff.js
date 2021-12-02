const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');

//les différentes routes par lequels devront passé la requète afin d'être traité celon chaque
//possibilité.

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOneSauce);

module.exports = router;