import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

import { UserContext } from "../context/userContext";
import Loader from "../components/Loader";

const EditPosts = () => {
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Uncategorized");
    const [desc, setDesc] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();
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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/posts/${id}`
                );
                setTitle(response?.data?.title);
                setCategory(response?.data?.category);
                setDesc(response?.data?.description);
                // setThumbnail(response?.data?.thumbnail);
            } catch (error) {
                console.log(error);
            }

            setIsLoading(false);
        };

        fetchPost();
    }, [id]);

    const editPost = async (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.set("title", title);
        postData.set("category", category);
        postData.set("description", desc);
        if (thumbnail) postData.set("thumbnail", thumbnail);

        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
                postData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                navigate("/");
            }
        } catch (error) {
            setError(error?.response?.data?.message ?? error?.message ?? error);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <section className="create-post">
            <div className="container">
                <h2>Edit Post</h2>
                {error ? <p className="form__error-message">{error}</p> : null}

                <form
                    action=""
                    className="form create-post__form"
                    onSubmit={editPost}
                >
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
                        Update
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditPosts;
