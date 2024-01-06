import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { HttpError, UserModel, PostModel } from "../models/index.js";

const __dirname = path.resolve();

export const createPost = async (req, res, next) => {
    try {
        const { title, category, description } = req.body;

        if (!title || !category || !description || !req.files) {
            return next(
                new HttpError("Fill in all fields and choose thumbnail.", 422)
            );
        }

        const { thumbnail } = req.files;
        if (thumbnail.size > 500000) {
            return next(
                new HttpError("Thumbnail too big. File should be less than 5md.")
            );
        }

        const splittedFileName = thumbnail.name.split(".");
        const newFileName =
            splittedFileName[0] + uuid() + "." + splittedFileName.at(-1);
        thumbnail.mv(
            path.join(__dirname, "uploads", newFileName),
            async (error) => {
                if (error) {
                    return next(new HttpError(error));
                }

                const newPost = await PostModel.create({
                    title,
                    description,
                    category,
                    thumbnail: newFileName,
                    creator: req.user.id
                });
                if (!newPost) {
                    return next(new HttpError("Post couldn't be created", 422));
                }

                // find user and increase post count by 1
                const currentUser = await UserModel.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await UserModel.findByIdAndUpdate(req.user.id, {
                    posts: userPostCount
                });

                res.status(201).json(newPost);
            }
        );
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find().sort({ updateAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findById(postId);

        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const getCatPosts = async (req, res, next) => {
    try {
        const category = req.params.category;
        const catPosts = await PostModel.find({ category }).sort({
            createdAt: -1
        });
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userPosts = await PostModel.find({ creator: userId }).sort({
            createdAt: -1
        });
        res.status(200).json(userPosts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const editPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, description } = req.body;

        if (!title || !category || !description) {
            return next(new HttpError("Fill in all fields", 422));
        }

        let updatedPost = null;
        if (!req.files) {
            updatedPost = await PostModel.findByIdAndUpdate(postId, {
                title,
                category,
                description
            });

            res.status(200).json(updatedPost);
        } else {
            // get old post from database
            const oldPost = await PostModel.findById(postId);

            if (req.user.id === oldPost.creator.toString()) {
                // delete ol thumbnail from uploads folder
                fs.unlink(
                    path.join(__dirname, "uploads", oldPost.thumbnail),
                    async (error) => {
                        if (error) {
                            return next(new HttpError(error, 422));
                        }

                        // upload new thumbnail
                        const thumbnail = req.files.thumbnail;
                        // check file size
                        if (thumbnail.size > 500000) {
                            return next(
                                new HttpError(
                                    "Thumbnail too big. Should be less than 5md.",
                                    422
                                )
                            );
                        }

                        const splittedFileName = thumbnail.name.split(".");
                        const newFileName =
                            splittedFileName[0] +
                            uuid() +
                            "." +
                            splittedFileName.at(-1);
                        thumbnail.mv(
                            path.join(__dirname, "uploads", newFileName),
                            async (error) => {
                                if (error) {
                                    return next(new HttpError(error));
                                }
                            }
                        );

                        updatedPost = await PostModel.findByIdAndUpdate(
                            postId,
                            {
                                title,
                                category,
                                description,
                                thumbnail: newFileName
                            },
                            { new: true }
                        );

                        if (!updatedPost) {
                            return next(
                                new HttpError("Couldn't update post", 400)
                            );
                        }
                        res.status(200).json(updatedPost);
                    }
                );
            } else {
                return next(new HttpError("Post couldn't be edited", 403));
            }
        }
    } catch (error) {
        return next(new HttpError(error));
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable", 400));
        }

        const post = await PostModel.findById(postId);

        if (req.user.id === post.creator.toString()) {
            const fileName = post?.thumbnail;
            fs.unlink(
                path.join(__dirname, "uploads", fileName),
                async (error) => {
                    if (error) {
                        return next(new HttpError(error));
                    }

                    await PostModel.findByIdAndDelete(postId);

                    // find user and decrease post count by 1
                    const currentUser = await UserModel.findById(req.user.id);
                    const userPostCount = currentUser.posts - 1;
                    await UserModel.findByIdAndUpdate(req.user.id, {
                        posts: userPostCount
                    });

                    res.status(200).json(
                        `Post ${postId} deleted successfully.`
                    );
                }
            );
        } else {
            return next(new HttpError("Post couldn't be deleted", 403));
        }
    } catch (error) {
        return next(new HttpError(error));
    }
};
