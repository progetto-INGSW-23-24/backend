import { DataTypes } from "sequelize";

const DescendingAuctionModel = {
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
    minimumPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    decreaseAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    decreaseTime: {
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

export function isDescendingAuctionExpired(auction) {
    const {
        createdAt,       // Data di inizio dell'asta
        startingPrice,   // Prezzo iniziale
        minimumPrice,    // Prezzo minimo
        decreaseAmount,  // Ribasso per intervallo
        decreaseTime     // Tempo tra i ribassi in minuti
    } = auction;

    const now = new Date();
    const auctionStartTime = new Date(createdAt);

    // Tempo trascorso dall'inizio dell'asta in millisecondi
    const timeElapsed = now - auctionStartTime;

    // Converti decreaseTime da minuti a secondi
    const decreaseTimeInSeconds = decreaseTime * 60;

    // Numero di ribassi già avvenuti
    const decreasesOccurred = Math.floor(timeElapsed / 1000 / decreaseTimeInSeconds);

    // Prezzo corrente calcolato
    let currentPrice = startingPrice - (decreasesOccurred * decreaseAmount);

    // Verifica se l'asta è scaduta (prezzo ha raggiunto il minimo)
    return currentPrice <= minimumPrice;
}

export default DescendingAuctionModel; 