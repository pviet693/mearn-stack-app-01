import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../context/userContext";
import Loader from "../components/Loader";

const DeletePost = ({ postId }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;
    const [isLoading, setIsLoading] = useState(false);

    // redirect to login page for any user who isn't logged in
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    });

    const removePost = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                if (location.pathname === `/myposts/${currentUser?.id}`) {
                    navigate(0);
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    }

    if (isLoading) return <Loader />;

    return (
        <Link className="btn sm danger" onClick={() => removePost(postId)}>
            Delete
        </Link>
    );
};

export default DeletePost;
