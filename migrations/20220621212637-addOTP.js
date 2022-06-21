"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Users", "OTP", { type: Sequelize.STRING });
        await queryInterface.addColumn("Users", "OTPExpiresAt", { type: Sequelize.DATE });
        await queryInterface.addColumn("Users", "verified", { type: Sequelize.BOOLEAN });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Users", "OTP", {});
        await queryInterface.removeColumn("Users", "OTPExpiresAt", {});
        await queryInterface.removeColumn("Users", "verified", {});
    },
};
