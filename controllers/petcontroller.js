"use strict";

const { Pet } = require("../models/index");
const axios = require("axios").default;
class PetController {
    static async listAllPets(req, res, next) {
        try {
            const pets = await Pet.findAll();

            res.status(200).json({
                statusCode: 200,
                pets: pets,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getPetDetail(req, res, next) {
        try {
            let id = +req.params.id;
            const pet = await Pet.findOne({
                where: {
                    id: id,
                },
            });

            if (!pet) {
                throw { code: 404 };
            }

            res.status(200).json({
                statusCode: 200,
                pet: pet,
            });
        } catch (err) {
            next(err);
        }
    }

    static async addPet(req, res, next) {
        try {
            const {
                name,
                gender,
                age,
                size,
                primaryBreed,
                secondaryBreed,
                mixedBreed,
                unknownBreed,
                spayed,
                houseTrained,
                declawed,
                specialNeeds,
                shots,
                goodWithChildren,
                goodWithDogs,
                goodWithCats,
                imageUrl,
                description,
            } = req.body;

            // const UserId = req.user.id;

            const newPet = await Pet.create({
                name,
                gender,
                age,
                size,
                primaryBreed,
                secondaryBreed,
                mixedBreed,
                unknownBreed,
                spayed,
                houseTrained,
                declawed,
                specialNeeds,
                shots,
                goodWithChildren,
                goodWithDogs,
                goodWithCats,
                imageUrl,
                description,
            });

            res.status(201).json({
                statusCode: 201,
                message: `Pet ${newPet.name} succesfully added`,
            });
        } catch (err) {
            next(err);
        }
    }
    static async getDogBreed(req, res, next) {
        try {
            let breed = await axios({
                method: "get",
                url: "https://api.thedogapi.com/v1/breeds",
                headers: {
                    "x-api-key": process.env.dogAPI_key,
                },
            });
            let data = breed.data;
            data.forEach((el) => {
                delete el.weight;
                delete el.height;
                delete el.id;
                delete el.reference_image_id;
                delete el.image;
            });

            res.status(200).json({
                statusCode: 200,
                data,
            });
        } catch (err) {
            next(err);
        }
    }
    static async UpdatePetDetails(req, res, next) {
        try {
            const {
                name,
                gender,
                age,
                size,
                primaryBreed,
                secondaryBreed,
                mixedBreed,
                unknownBreed,
                spayed,
                houseTrained,
                declawed,
                specialNeeds,
                shots,
                goodWithChildren,
                goodWithDogs,
                goodWithCats,
                imageUrl,
                description,
            } = req.body;

            const petDetail = await Pet.update(
                {
                    name,
                    gender,
                    age,
                    size,
                    primaryBreed,
                    secondaryBreed,
                    mixedBreed,
                    unknownBreed,
                    spayed,
                    houseTrained,
                    declawed,
                    specialNeeds,
                    shots,
                    goodWithChildren,
                    goodWithDogs,
                    goodWithCats,
                    imageUrl,
                    description,
                },
                { where: { id: +req.params.id } }
            );
            res.status(200).json({
                statusCode: 200,
                message: `Pet detail updated`,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = PetController;
