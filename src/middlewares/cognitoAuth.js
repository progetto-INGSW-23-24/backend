import jwt from 'jsonwebtoken'; 

const cognitoAuth = (req, res, next) => {

    const token = req.headers['authorization']; 

    if(!token) {
        return res.status(401).json({message: 'Missing Token'}); 
    }

    const decodedToken = jwt.decode(token); 

    if(!decodedToken) {
        return res.status(401).json({message: 'Token not Valid'}); 
    }

    const cognitoSub = decodedToken.sub;
    console.log(`ID univoco dell\'utente: ${cognitoSub}`);

    req.user = {
        userId: cognitoSub,
        email: decodedToken.email
    }

    next(); 

}

export default cognitoAuth; 