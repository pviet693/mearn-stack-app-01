import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/users`
                );
                setAuthors(response?.data || []);
            } catch (error) {
                console.log(error);
            }

            setIsLoading(false);
        };

        fetchAuthors();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <section className="authors">
            {authors.length ? (
                <div className="container authors__container">
                    {authors.map((author) => (
                        <Link
                            to={`/posts/users/${author._id}`}
                            className="author"
                        >
                            <div className="author__avatar">
                                <img
                                    src={`${process.env.REACT_APP_ASSETS_URL}/${author.avatar}`}
                                    alt=""
                                />
                            </div>

                            <div className="author__info">
                                <h4>{author.name}</h4>
                                <p>{author.posts}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <h2 className="center">No users/authors founds.</h2>
            )}
        </section>
    );
};

export default Authors;
