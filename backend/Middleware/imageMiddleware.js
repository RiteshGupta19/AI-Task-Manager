const multer = require('multer');
const path = require('path');


const storage = multer.memoryStorage();

const taskUpload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 2 MB
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|pdf|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Unsupported image format! Accepted formats are: jpeg, jpg, png, webp.');
        }
    }
});

module.exports = taskUpload;

