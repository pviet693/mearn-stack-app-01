import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { HttpError, UserModel } from "../models/index.js";

const __dirname = path.resolve();

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password || !password2) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

        const emailExists = await UserModel.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }

        if (password.trim().length < 6) {
            return next(
                new HttpError("Password should be at least 6 characters.", 422)
            );
        }

        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await UserModel.create({
            name,
            email: newEmail,
            password: hashedPassword
        });
        res.status(201).json(
            `New user ${newUser.email} registered successfully.`
        );
    } catch (error) {
        return next(new HttpError("User registers failed.", 422));
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

        const user = await UserModel.findOne({ email: newEmail });
        if (!user) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        res.status(200).json({ token, id, name });
    } catch (error) {
        return next(
            new HttpError("Login failed. Please check your credentials.", 422)
        );
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }

        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError("Please choose an image.", 422));
        }

        const user = await UserModel.findById(req?.user?.id);
        // delete old avatar if exists
        if (user?.avatar) {
            fs.unlink(path.join(__dirname, "uploads", user.avatar), (error) => {
                if (error) {
                    return next(new HttpError(error));
                }
            });
        }

        const { avatar } = req.files;
        // check file size
        if (avatar.size > 500000) {
            return next(
                new HttpError(
                    "Profile picture is too big. Should be less than 500Kb",
                    422
                )
            );
        }

        const splittedFileName = avatar.name.split(".");
        const newFileName =
            splittedFileName[0] + uuid() + "." + splittedFileName.at(-1);
        avatar.mv(
            path.join(__dirname, "uploads", newFileName),
            async (error) => {
                if (error) {
                    return next(new HttpError(error));
                }

                const updatedAvatar = await UserModel.findByIdAndUpdate(
                    req?.user?.id,
                    { avatar: newFileName },
                    { new: true }
                );
                if (!updatedAvatar) {
                    return next(
                        new HttpError("Avatar couldn't be changed.", 422)
                    );
                }

                res.status(200).json(updatedAvatar);
            }
        );
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const editUser = async (req, res, next) => {
    try {
        const { name, email, curPassword, newPassword, confirmNewPassword } =
            req.body;

        if (!name || !email || !curPassword || !newPassword || !confirmNewPassword) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        // get user from database
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found.", 403));
        }

        // make sure new email doesn't already exist
        const emailExists = await UserModel.findOne({ email });
        if (emailExists && emailExists._id.toString() !== req.user.id) {
            return next(new HttpError("Email already exist.", 422));
        }

        // compare curPassword to db password
        const compare = await bcrypt.compare(curPassword, user.password);
        if (!compare) {
            return next(new HttpError("Invalid current password.", 422));
        }

        // compare new password
        if (newPassword !== confirmNewPassword) {
            return next(new HttpError("New passwords do not match.", 422));
        }

        // hash new password
        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // update user info in database
        const newInfo = await UserModel.findByIdAndUpdate(
            req.user.id,
            { name, email, password: hashedNewPassword },
            { new: true }
        );

        res.status(200).json(newInfo);
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const getAuthors = async (req, res, next) => {
    try {
        const authors = await UserModel.find().select("-password");
        res.status(200).json(authors);
    } catch (error) {
        return next(new HttpError(error));
    }
};
