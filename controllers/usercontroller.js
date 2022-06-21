"use script";

const { User, Pet } = require("../models/index.js");
const { convertPayloadToToken } = require("../helpers/jwt");
const { hash, compare } = require("../helpers/bcrypt");
const nodemailer = require("nodemailer");
const user = require("../models/user.js");
let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.nodemailer_mail,
        pass: process.env.nodemailer_pass,
    },
});

class UserController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            const hashedOTP = hash(otp);
            var today = new Date();
            today.setHours(today.getHours() + 4);
            const newUser = await User.create({
                username,
                email,
                password,
                OTP: hashedOTP,
                OTPExpiresAt: today,
                verified: false,
            });

            const mailOptions = {
                from: process.env.nodemailer_mail,
                to: newUser.email,
                subject: "Verify your Email",
                html: `<p> Enter <b>${otp}</b> in the website to verify your email address.`,
            };
            transporter.sendMail(mailOptions);

            res.status(201).json({
                statusCode: 201,
                message: "user succesfully created. please verify your email",
                data: { username: newUser.username, email: newUser.email },
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyUser(req, res, next) {
        try {
            let id = req.user.id;
            let otp = req.body.otp;
            if (!id || !otp) {
                throw { code: 400 };
            }
            let user = await User.findOne({ where: { id: id } });

            if (user.OTPExpiresAt < new Date()) {
                throw new Error("OTP Exired, please request a new OTP");
            } else {
                let otpCompare = compare(otp, user.OTP);

                if (otpCompare) {
                    await User.update(
                        {
                            verified: true,
                        },
                        {
                            where: {
                                id: id,
                            },
                        }
                    );
                } else {
                    throw { code: 403 };
                }

                res.status(200).json({
                    statusCode: 200,
                    message: "account is now verified",
                });
            }
        } catch (err) {
            next(err);
        }
    }

    static async requestOTP(req, res, next) {
        try {
            let id = req.user.id;
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            const hashedOTP = hash(otp);
            const user = await User.findOne({ where: { id: id } });
            var today = new Date();
            today.setHours(today.getHours() + 4);

            await User.update(
                {
                    OTP: hashedOTP,
                    OTPExpiresAt: today,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            const mailOptions = {
                from: process.env.nodemailer_mail,
                to: user.email,
                subject: "Verify your Email",
                html: `<p> Enter <b>${otp}</b> in the website to verify your email address. this token expires in 1 hour.`,
            };
            transporter.sendMail(mailOptions);

            res.status(201).json({
                statusCode: 200,
                message: "OTP Resent.",
                data: { username: newUser.username, email: newUser.email },
            });
            if (!id) {
                throw { code: 400 };
            }
        } catch (err) {
            next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                where: {
                    email: email,
                },
            });
            if (!user) {
                throw { code: 401 };
            }
            const PasswordCompare = compare(password, user.password);
            if (!PasswordCompare) {
                throw { code: 401 };
            }
            let payload = {
                id: user.id,
                email: user.email,
            };
            payload = convertPayloadToToken(payload);
            res.status(200).json({
                statusCode: 200,
                access_token: payload,
                username: user.username,
                email: user.email,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserDetail(req, res, next) {
        try {
            let id = +req.params.id;
            const user = await User.findOne({
                attributes: {
                    where: {
                        id,
                    },
                    exclude: ["password", "createdAt", "updatedAt"],
                },
                include: {
                    model: Pet,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            });

            if (!user) {
                throw { code: 404 };
            }
            res.status(200).json({
                statusCode: 200,
                user: user,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;
