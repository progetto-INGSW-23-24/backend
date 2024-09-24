import { User } from '../models/index.js'; 
import HttpError from '../config/HttpError.js'; 
import cognito from '../config/cognito.js'; 
import https from 'https'; 
import queryString from 'query-string';
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID, COGNITO_REGION, DOMAIN, DB_PORT } from '../config/environment.js';

class AuthController {

    static async resendEmailConfirmCode(req, res, next) {
        const email = req.body; 

        const params = {
            ClientId: COGNITO_CLIENT_ID,
            Username: email
        }; 

        try {
            const result = cognito.resendConfirmationCode(params).promise();
            res.status(200).json({message: "Codice di conferma reinviato", result});  
        } catch(error) {
            next(new HttpError("Errore nel reinvio del codice di conferma", 400)); 
        }
        
    }

    static async signin(req, res, next) {
        const { email, password } = req.body;
    
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: COGNITO_CLIENT_ID, // Assicurati di avere COGNITO_CLIENT_ID nel tuo .env
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };
    
        try {
            // 1. Autenticazione dell'utente con Cognito
            const authResult = await cognito.initiateAuth(params).promise();
    
            // 2. Verifica dello stato dell'email (se confermata)
            const userParams = {
                UserPoolId: COGNITO_USER_POOL_ID, // Assicurati che COGNITO_USER_POOL_ID sia nel tuo .env
                Username: email
            };
            const cognitoUser = await cognito.adminGetUser(userParams).promise();
    
            // 3. Troviamo l'attributo email_verified
            const emailVerifiedAttribute = cognitoUser.UserAttributes.find(
                attr => attr.Name === 'email_verified'
            );
    
            const isEmailVerified = emailVerifiedAttribute && emailVerifiedAttribute.Value === 'true';
    
            // 4. Controlliamo se l'email è confermata
            if (!isEmailVerified) {
                return next(new HttpError('Email non confermata. Verifica la tua casella di posta.', 400));
            }
    
            // 5. Se l'email è confermata, restituire i token di autenticazione
            const { IdToken, AccessToken, RefreshToken } = authResult.AuthenticationResult;
    
            const user = await User.findOne({where: {email: email}}); 

            // Restituiamo i token JWT
            res.status(200).json({
                message: 'Login effettuato con successo',
                user: user,
                tokens: {
                    IdToken,
                    AccessToken,
                    RefreshToken
                }
            });
    
        } catch (error) {
            // 6. Gestione degli errori
            console.log("Signin Error:", error);
            
            if (error.code === 'NotAuthorizedException') {
                return next(new HttpError('Credenziali non valide. Verifica email e password.', 401)); // Errore 401 - Non autorizzato
            } else if (error.code === 'UserNotFoundException') {
                return next(new HttpError('Utente non trovato. Verifica email e password.', 404)); // Errore 404 - Utente non trovato
            } else if (error.code === 'UserNotConfirmedException') {
                return next(new HttpError('Email non confermata. Completa la verifica della tua email.', 400)); // Errore 400 - Email non confermata
            }
    
            return next(new HttpError('Errore durante il login, riprova', 500)); // Errore generico 500
        }
    }

    static async signup(req, res, next) {
        const { email, password, given_name, family_name } = req.body; 
        console.log(email, password, given_name, family_name);
    
        // Controlla che tutti i campi richiesti siano presenti
        if (!email || !password || !given_name || !family_name) {
            return next(new HttpError('Campi mancanti', 400));
        }
    
        const params = {
            ClientId: COGNITO_CLIENT_ID,
            Username: email,  // Usiamo l'email come Username
            Password: password,
            UserAttributes: [
                {
                    Name: "email",
                    Value: email
                },
                {
                    Name: "given_name",
                    Value: given_name
                },
                {
                    Name: "family_name",
                    Value: family_name
                }
            ]
        };
    
        try {
            // Esegui la registrazione dell'utente
            const signup = await cognito.signUp(params).promise(); 
            
            const newUser = await User.create({
                    id: signup.UserSub, 
                    firstname: given_name,
                    lastName: family_name,
                    email: email,
                    bio: "", 
                    webSiteLink: "",
                    profileImagePath: "",
                    socialLink: []
                })
            
            res.status(200).json({message: `Registrazione Inviata`, user: newUser}); 
    
        } catch (error) {
            // Gestione degli errori specifici di Cognito
            if (error.code === 'UsernameExistsException') {
                return next(new HttpError('Questo utente esiste già.', 409));
            } else if (error.code === 'InvalidPasswordException') {
                return next(new HttpError('Password non valida. Deve rispettare i criteri di sicurezza.', 400));
            } else {
                // Gestisci qualsiasi altro errore
                console.error('Errore durante la registrazione:', error); // Logga l'errore per il debug
                return next(new HttpError('Errore durante la registrazione o il login.', 500));
            }
        }
    }

    static async signupWithGoogle(req, res, next) {
        const { code } = req.query;
    
        // Se non c'è il codice di autorizzazione, reindirizza l'utente a Google per il login
        if (!code) {
            const googleAuthUrl = `https://${COGNITO_USER_POOL_ID}.auth.${COGNITO_REGION}.amazoncognito.com/oauth2/authorize`;
            const queryParams = queryString.stringify({
                response_type: 'code',
                client_id: COGNITO_CLIENT_ID,
                redirect_uri: `${DOMAIN}:${DB_PORT}/googleSignup`,
                scope: 'openid profile email',
                identity_provider: 'Google',
            });
            console.log('queryParams:', queryParams);
    
            return res.redirect(`${googleAuthUrl}?${queryParams}`); // Usa return qui
        }
    
        // Se il codice è presente, scambia il code per ottenere i token JWT
        try {
            const tokenUrl = `https://${COGNITO_USER_POOL_ID}.auth.${COGNITO_REGION}.amazoncognito.com/oauth2/token`;
            const postData = queryString.stringify({
                grant_type: 'authorization_code',
                client_id: COGNITO_CLIENT_ID,
                code: code,
                redirect_uri: `${DOMAIN}:${DB_PORT}/googleSignup`,
            });
    
            const options = {
                hostname: `${COGNITO_USER_POOL_ID}.auth.${COGNITO_REGION}.amazoncognito.com`,
                path: '/oauth2/token',
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(postData), // Usa Buffer.byteLength per la lunghezza corretta
                },
            };
    
            const tokenResponse = await new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let data = '';
    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
    
                    res.on('end', () => {
                        resolve(JSON.parse(data));
                    });
                });
    
                req.on('error', (e) => {
                    reject(e);
                });
    
                req.write(postData);
                req.end();
            });
    
            const { access_token, id_token, refresh_token } = tokenResponse;
    
            return res.status(200).json({
                message: "Autenticazione Google completata con successo!",
                accessToken: access_token,
                idToken: id_token,
                refreshToken: refresh_token,
            });
    
        } catch (error) {
            console.error('Errore durante il flusso OAuth con Google:', error);
            return next(new HttpError('Errore durante il login con Google.', 500)); // Usa return qui
        }
    }

}

export default AuthController; 