// middleware/upload.js
import path from 'path';
import multer from 'multer';

// Configurazione di multer per salvare le immagini
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'auctionsImages/'); // Cartella in cui salvare le immagini
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome file unico
    }
});

const upload = multer({ storage: storage });

export default upload; 
