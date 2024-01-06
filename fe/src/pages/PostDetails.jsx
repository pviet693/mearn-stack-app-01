import React, { useEffect, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PostAuthor from "../components/PostAuthor";
import Thumbnail from "../assets/blog22.jpg";

import { UserContext } from "../context/userContext";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
                setPost(response?.data || {});
            } catch (error) {
                console.log(error);
            }

            setIsLoading(false);
        };

        getPost();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <section className="post-details">
            {error ? <p className="error">{error}</p> : null}
            {post ? (
                <div className="container post-details__container">
                    <div className="post-details__header">
                        <PostAuthor
                            authorID={post.creator}
                            createdAt={new Date(post.createdAt)}
                        />
                        {currentUser?.id === post.creator ? (
                            <div className="post-details__button">
                                <Link
                                    to={`/posts/${post._id}/edit`}
                                    className="btn sm primary"
                                >
                                    Edit
                                </Link>
                                <DeletePost postId={id} />
                            </div>
                        ) : null}
                    </div>
                    <h1>{post.title}</h1>
                    <div className="post-details__thumbnail">
                        <img src={`${process.env.REACT_APP_ASSETS_URL}/${post.thumbnail}`} alt="" />
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
                </div>
            ) : null}
        </section>
    );
};

export default PostDetails;
