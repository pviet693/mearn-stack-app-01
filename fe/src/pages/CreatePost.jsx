import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

import { UserContext } from "../context/userContext";

const CreatePosts = () => {
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Uncategorized");
    const [desc, setDesc] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    // redirect to login page for any user who isn't logged in
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    });

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"], // toggled buttons

            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" }
            ],

            ["link", "image"]["clean"]
        ]
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image"
    ];

    const POST_CATEGORIES = [
        "Agriculture",
        "Business",
        "Education",
        "Entertainment",
        "Art",
        "Investment",
        "Uncategorized",
        "Weather"
    ];

    const createPost = async (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.set("title", title);
        postData.set("category", category);
        postData.set("description", desc);
        postData.set("thumbnail", thumbnail);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/posts`,
                postData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                navigate("/");
            }
        } catch (error) {
            setError(error?.response?.data?.message ?? error?.message ?? error);
        }
    };

    return (
        <section className="create-post">
            <div className="container">
                <h2>Create Post</h2>
                {error ? (<p className="form__error-message">{error}</p>) : null}

                <form action="" className="form create-post__form" onSubmit={createPost}>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={title}
                        onChange={(evt) => setTitle(evt.target.value)}
                    />
                    <select
                        value={category}
                        onChange={(evt) => setCategory(evt.target.value)}
                    >
                        {POST_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        value={desc}
                        onChange={setDesc}
                    />
                    <input
                        type="file"
                        onChange={(evt) => setThumbnail(evt.target.files[0])}
                        accept="png, jpg, jpeg"
                    />

                    <button type="submit" className="btn primary">
                        Create
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CreatePosts;
