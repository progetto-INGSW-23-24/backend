import AWS from 'aws-sdk';
import multer from 'multer';
import {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_AWS_REGION,
    S3_BUCKET_NAME,
} from '../config/environment.js';


// Configura AWS S3
const s3 = new AWS.S3({
    region: S3_AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export const upload = multer({ storage: multer.memoryStorage() });


// Middleware per caricare su 'auctionsImages'
export const uploadAuctionImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nessun file caricato' });
    }

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: `auctionImages/${Date.now()}-${req.file.originalname}`, // Nome univoco per il file
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Errore durante il caricamento dell'immagine" });
        }

        req.imageLocation = data.Location;
        console.log(`@#@#@#@#@#@# IMAGE LOCATION: ${data.Location}`);

        next();
    });
};

// Middleware per caricare su 'profilePictures'
export const uploadProfilePicture = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nessun file caricato' });
    }

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: `profileImages/${Date.now()}-${req.file.originalname}`, // Nome univoco per il file
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Errore durante il caricamento dell'immagine" });
        }

        req.imageLocation = data.Location;
        console.log(`@#@#@#@#@#@# IMAGE LOCATION: ${data.Location}`);

        next();
    });
};
