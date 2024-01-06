import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostItem from "../components/PostItem";
import Loader from "../components/Loader";

const CategoryPosts = () => {
    const { category } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`
                );
                setPosts(response?.data || []);
            } catch (error) {
                console.log(error);
            }

            setIsLoading(false);
        };

        fetchPosts();
    }, [category]);

    if (isLoading) return <Loader />;

    return (
        <section className="posts">
            {posts.length ? (
                <div className="container posts__container">
                    {posts.map((post) => (
                        <PostItem post={post} key={post.id} />
                    ))}
                </div>
            ) : (
                <h2 className="center">No Posts Founds</h2>
            )}
        </section>
    );
};

export default CategoryPosts;
