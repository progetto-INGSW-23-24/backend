import { User } from "../models/index.js";

class UserController {

    static async modifyProfile(req, res, next) {
        try {
            // Id dell'utente autenticato (puoi ottenerlo dal token o da req.user.id)
            const userId = req.user.id;

            // Trova l'utente nel database
            const user = await User.findByPk(userId);
            
            if (!user) {
                return res.status(404).json({ message: "Utente non trovato." });
            }

            // Campi che l'utente può modificare
            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                bio: req.body.bio,
                webSiteLink: req.body.webSiteLink,
                profileImagePath: req.body.profileImagePath,
                fcm: req.body.fcm, 
                socialLink: req.body.socialLink
            };

            // Aggiorna solo i campi presenti nel body della richiesta
            await user.update(updateData, { fields: Object.keys(updateData) });

            // Risposta di successo
            return res.status(200).json({
                message: "Profilo aggiornato con successo.",
                user
            });
        } catch (error) {
            console.error("Errore nell'aggiornamento del profilo:", error);
            next(new HttpError(`Errore nell'aggiornamento del profilo: ${error.message}`, 500));
        }
    }

}

export default UserController; 