import React, { useState, useEffect } from "react";
import axios from "axios";

import PostItem from "./PostItem";
import Loader from "./Loader";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
                setPosts(response?.data || []);
            } catch (error) {
                console.log(error);
            }

            setIsLoading(false);
        };
        
        fetchPosts();
    }, []);

    if (isLoading) return <Loader />

    console.log(posts);

    return (
        <section className="posts">
            {posts.length ? (
                <div className="container posts__container">
                    {posts.map((post) => (
                        <PostItem post={post} key={post._id} />
                    ))}
                </div>
            ) : (
                <h2 className="center">No Posts Founds</h2>
            )}
        </section>
    );
};

export default Posts;
