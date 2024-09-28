import jwt from 'jsonwebtoken';
import { COGNITO_REGION, COGNITO_USER_POOL_ID } from '../config/environment';

let pems = {}; // Oggetto per memorizzare le chiavi

// Funzione per scaricare le chiavi pubbliche da AWS Cognito
const getPems = async () => {
    let region = COGNITO_REGION;
    let userPoolId = COGNITO_USER_POOL_ID;

    const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    const response = await axios.get(url);
    const { keys } = response.data;

    // Converti ciascun JWK in PEM e memorizzali
    keys.forEach(key => {
        const pem = jwkToPem(key);
        pems[key.kid] = pem;
    });
};

// Middleware di autenticazione
const cognitoAuth = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token mancante o non valido' });
    }

    const jwtToken = token.split(' ')[1];

    try {
        // Verifica il token JWT
        const decodedToken = jwt.decode(jwtToken, { complete: true });
        const kid = decodedToken.header.kid; // Recupera l'ID della chiave

        if (!pems[kid]) {
            // Se non abbiamo già memorizzato il PEM, scaricalo
            await getPems();
        }

        const pem = pems[kid];

        // Verifica la firma e l'integrità del token
        jwt.verify(jwtToken, pem, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token non valido' });
            }

            // Se il token è valido, puoi inserire i dati dell'utente nella request
            req.user = {
                userId: decodedToken.sub,
            };
            next();
        });
    } catch (error) {
        return res.status(401).json({ message: 'Token non valido' });
    }
};

export default cognitoAuth; 