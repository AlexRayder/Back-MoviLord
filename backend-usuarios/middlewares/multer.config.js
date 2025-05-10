const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento dinámica según el tipo de archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/others';
    if (file.fieldname === 'video') folder = 'uploads/videos';
    if (file.fieldname === 'thumbnail') folder = 'uploads/thumbnails';

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});

// Filtro de tipos de archivo
const fileFilter = (req, file, cb) => {
  const videoTypes = ['video/mp4', 'video/mkv', 'video/webm'];
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (
    (file.fieldname === 'video' && videoTypes.includes(file.mimetype)) ||
    (file.fieldname === 'thumbnail' && imageTypes.includes(file.mimetype))
  ) {
    cb(null, true);
  } else {
    cb(new Error('Archivo no permitido'), false);
  }
};

// Configuración final de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB máximo por archivo
  }
});

module.exports = upload;
