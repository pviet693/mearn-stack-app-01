import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import axios from "axios";

import { UserContext } from "../context/userContext";
import Loader from "../components/Loader";

const UserProfile = () => {
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [curPassword, setCurPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isAvatarTouched, setIsAvatarTouched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/users/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setAvatar(response?.data?.avatar ?? "");
                setName(response?.data?.name ?? "");
                setEmail(response?.data?.email ?? "");
            } catch (error) {
                console.log(error);
            }

            setIsLoading(false);
        };

        fetchUser();
    }, [id, token]);

    if (isLoading) return <Loader />;

    const changeAvatarHandler = async () => {
        setError("");
        const postData = new FormData();
        postData.set("avatar", avatar);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
                postData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAvatar(response?.data?.avatar);
        } catch (error) {
            console.log(error);
            setError(error?.response?.data?.message ?? error?.message ?? error);
        }
    };

    const updateUserDetails = async (e) => {
        e.preventDefault();
        setError("");

        const postData = new FormData();
        postData.set("name", name);
        postData.set("email", email);
        postData.set("curPassword", curPassword);
        postData.set("newPassword", newPassword);
        postData.set("confirmNewPassword", confirmNewPassword);

        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
                postData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                // logout user
                navigate("/logout");
            }
        } catch (error) {
            setError(error?.response?.data?.message ?? error?.message ?? error);
        }
    };

    return (
        <section className="profile">
            <div className="container profile__container">
                <Link to={`/myposts/${currentUser?.id}`} className="btn">
                    My Posts
                </Link>

                <div className="profile__details">
                    <div className="avatar__wrapper">
                        <div className="profile__avatar">
                            <img
                                src={`${process.env.REACT_APP_ASSETS_URL}/${avatar}`}
                                alt=""
                            />
                        </div>

                        {/* Form to update avatar */}
                        <form action="" className="avatar__form">
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                accept="png, jpg, jpeg"
                                onChange={(evt) =>
                                    setAvatar(evt.target.files[0])
                                }
                            />
                            <label
                                htmlFor="avatar"
                                onClick={() => setIsAvatarTouched(true)}
                            >
                                <FaEdit />
                            </label>
                        </form>

                        {isAvatarTouched ? (
                            <button
                                className="profile__avatar-btn"
                                onClick={changeAvatarHandler}
                            >
                                <FaCheck />
                            </button>
                        ) : null}
                    </div>

                    <h1>Ernest Achiever</h1>

                    {/* form to update user details */}
                    <form action="" className="form profile__form" onSubmit={updateUserDetails}>
                        {error ? (
                            <p className="form__error-message">{error}</p>
                        ) : null}

                        <input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={name}
                            onChange={(evt) => setName(evt.target.value)}
                            autoFocus
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(evt) => setEmail(evt.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Current Password"
                            name="curPassword"
                            value={curPassword}
                            onChange={(evt) => setCurPassword(evt.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(evt) => setNewPassword(evt.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            name="newPassword"
                            value={confirmNewPassword}
                            onChange={(evt) =>
                                setConfirmNewPassword(evt.target.value)
                            }
                        />

                        <button type="submit" className="btn primary">
                            Update details
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
