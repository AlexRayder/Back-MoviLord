const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta donde se guardarán los videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/videos';
    fs.mkdirSync(dir, { recursive: true }); // crea la carpeta si no existe
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtro para aceptar solo videos
const videoFileFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/mkv', 'video/webm'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de video.'));
  }
};

const upload = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB máx.
});

module.exports = upload;
