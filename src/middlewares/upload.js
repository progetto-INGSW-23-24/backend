import { S3 } from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_AWS_REGION,
    S3_BUCKET_NAME,
} from '../config/environment.js';

// Configura AWS S3
const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: S3_AWS_REGION
});

// Funzione per creare un middleware di upload personalizzato
const createUploadMiddleware = (folderPath) => {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: S3_BUCKET_NAME,
            acl: 'public-read',
            key: function (req, file, cb) {
                // Definisci il nome del file su S3 con il percorso specificato
                const fileName = `${folderPath}/${Date.now()}_${file.originalname}`;
                cb(null, fileName);
            }
        }),
        limits: { fileSize: 1024 * 1024 * 5 }, // Limite del file (es. 5MB)
        fileFilter: (req, file, cb) => {
            // Filtra i file accettati, ad esempio solo immagini
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
            }
        }
    }).single('image'); // 'image' è il nome del campo nel form
};

// Middleware per caricare su 'auctionsImages'
export const uploadAuctionImage = createUploadMiddleware('auctionsImages');

// Middleware per caricare su 'profilePictures'
export const uploadProfilePicture = createUploadMiddleware('profilePictures');
