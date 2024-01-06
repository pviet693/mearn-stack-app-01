import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });
    const [error, setError] = useState();
    const navigate = useNavigate();

    const changeInputHandler = (evt) => {
        setUserData((preState) => ({
            ...preState,
            [evt.target.name]: evt.target.value
        }))
    };

    const registerUser = async (e) => {
        e.preventDefault();

        setError("");

        try {

            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/users/register`,
                userData
            );
            const newUser = response?.data;

            if (!newUser) {
                setError("Could'n register user. Please try again.");
            } else {
                navigate("/login");
            }
        } catch (error) {
            setError(error?.response?.data?.message ?? error?.message ?? error);
        }
    };
    
    return (
        <section className="register">
            <div className="container">
                <h2>Sign Up</h2>
                <form action="" className="form register__form" onSubmit={registerUser}>
                    {error ? (
                        <p className="form__error-message">
                            {error}
                        </p>
                    ) : null }
                    <input
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        value={userData.name}
                        onChange={changeInputHandler}
                        autoFocus
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={userData.email}
                        onChange={changeInputHandler}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={userData.password}
                        onChange={changeInputHandler}
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        name="password2"
                        value={userData.password2}
                        onChange={changeInputHandler}
                    />

                    <button type="submit" className="btn primary">Register</button>
                </form>

                <small>Already have an account? <Link to="/login">sign in</Link></small>
            </div>
        </section>
    );
};

export default Register;
