import { DataTypes } from "sequelize";
import { EnglishAuctionOffer } from "../index.js";

const EnglishAuctionModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imagePath: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: false
    },
    startingPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    increaseThreshold: {
        type: DataTypes.DOUBLE,
        defaultValue: 10,
    },
    timer: {
        type: DataTypes.SMALLINT,
        defaultValue: 60,
        allowNull: false
    },
    categories: {
        type: DataTypes.ARRAY(DataTypes.SMALLINT),
        allowNull: false,
        defaultValue: [],
    },
}

export async function isEnglishAuctionExpired(auction) {
    const now = new Date();
    const lastOffer = await EnglishAuctionOffer.findOne({
        where: { auctionId: auction.id },
        order: [['createdAt', 'DESC']]
    });

    if (!lastOffer) {
        // Se non ci sono offerte, l'asta è considerata scaduta
        return true;
    }

    const lastOfferTime = new Date(lastOffer.createdAt);
    lastOfferTime.setMinutes(lastOfferTime.getMinutes() + auction.timer);

    return now > lastOfferTime;
}

export default EnglishAuctionModel; 