const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Nous créons une constante storage , à passer à multer comme configuration, 
//qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    //on indique qu'il faut créer un fichier avec le nom d'origine, on remplace
    //les espaces par des _ et on rajoute un datenow qui est un nombre spéciale qui prend en
    //compte l'heure et les secondes etc.. enfin on met un . et on ajoute l'extension adapté
    //qu'on a récupérer en haut.
    callback(null, name + Date.now() + '.' + extension);
  }
});
// on envoie notre image enregistré dans notre dossier.

module.exports = multer({storage: storage}).single('image');