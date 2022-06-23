"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Match extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Match.belongsTo(models.User, { foreignKey: "UserId" });
            Match.belongsTo(models.Pet, { foreignKey: "PetId" });
        }
    }
    Match.init(
        {
            UserId: DataTypes.INTEGER,
            PetId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Match",
        }
    );
    return Match;
};
