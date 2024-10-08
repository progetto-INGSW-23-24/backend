import { User } from "../models/index.js";

class UserController {

    static async modifyProfile(req, res, next) {
        try {
            // Id dell'utente autenticato ottenuto dal middleware
            const userId = req.user.userId;

            // Campi che l'utente può modificare
            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                bio: req.body.bio,
                webSiteLink: req.body.webSiteLink,
                profileImagePath: req.imageLocation,
                fcm: req.body.fcm,
                socialLink: req.body.socialLink
            };


            // Aggiorna solo i campi presenti nel body della richiesta
            await User.update(updateData, { where: { id: userId }, fields: Object.keys(updateData) });

            // Risposta di successo
            return res.status(200).json({
                message: "Profilo aggiornato con successo.",
                image_path: req.imageLocation,
            });
        } catch (error) {
            console.error("Errore nell'aggiornamento del profilo:", error);
            next(new HttpError(`Errore nell'aggiornamento del profilo: ${error.message}`, 500));
        }
    }

}

export default UserController; 