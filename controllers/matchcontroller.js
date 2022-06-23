"use strict";

const { Match, User, Pet } = require("../models/index.js");
class MatchController {
    static async findYourMatches(req, res, next) {
        try {
            let id = req.user.id;
            let matches = await Match.findAll({
                where: {
                    UserId: id,
                },
                include: [
                    {
                        model: Pet,
                        include: [
                            {
                                model: User,
                                attributes: ["username", "email"],
                            },
                        ],
                    },
                ],
            });
            res.status(200).json({
                statusCode: 200,
                data: matches,
            });
        } catch (err) {
            next(err);
        }
    }
    static async createMatch(req, res, next) {
        try {
            let UserId = req.user.id;
            let PetId = +req.params.id;

            let check = await Match.findOne({
                where: {
                    UserId,
                    PetId,
                },
            });

            if (check) {
                res.status(200).json({
                    statusCode: 200,
                    message: "Match added",
                });
            } else {
                let newMatch = await Match.create({
                    UserId,
                    PetId,
                });

                res.status(200).json({
                    statusCode: 200,
                    message: "Match added",
                });
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MatchController;
