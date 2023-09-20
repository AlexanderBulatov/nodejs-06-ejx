const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public'));
  },
  filename(req, file, cb) {
    req.initialFileName = file.originalname;
    req.serverFileName = `${Date.now()}_id_${(file.originalname)}`;
    cb(null, req.serverFileName);
  },
});

module.exports = multer({ storage });
