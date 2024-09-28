import { CognitoJwtVerifier } from "aws-jwt-verify";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from '../config/environment.js';

// Middleware di autenticazione
const cognitoAuth = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token mancante o non valido' });
    }

    const jwtToken = token.split(' ')[1];

    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
        userPoolId: COGNITO_USER_POOL_ID,
        tokenUse: "access",
        clientId: COGNITO_CLIENT_ID,
    });

    try {
        const payload = await verifier.verify(jwtToken);

        req.user = { userId: payload.sub };
        next();
    } catch {
        return res.status(401).json({ message: 'Token non valido' });
    }
};

export default cognitoAuth; 