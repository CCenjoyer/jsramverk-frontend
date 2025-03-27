import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../Common/toast.jsx";

const apiLink = process.env.REACT_APP_API_LINK;

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const login = async () => {
        console.log("Attempting to log in");
        try {
            const response = await fetch(`${apiLink}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                sessionStorage.setItem("token", result.data.token);
                sessionStorage.setItem(
                    "user",
                    JSON.stringify({ email: result.data.user.email })
                );

                console.log(sessionStorage.getItem("token"));
                console.log(sessionStorage.getItem("user"));
                console.log("Logged in");
                Toast("Login Successful");

                // Dispatch custom event
                const event = new Event("userLoggedIn");
                window.dispatchEvent(event);

                navigate("/");
            } else {
                Toast(result.errors.detail);
            }
        } catch (error) {
            console.log("Network error", error);
        }
    };

    const register = async () => {
        console.log("Attempting register");
        console.log(credentials);
        try {
            const response = await fetch(`${apiLink}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Successfully Registered");
                Toast("Successfully Registered");
                login();
            } else {
                console.log("Error occurred while registering");
                Toast(result.errors.detail);
            }
        } catch (error) {
            Toast("Network error", error);
            console.log("Network error", error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        login();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <label className="input-label">Email</label>
            <input
                type="email"
                name="email"
                required
                className="input"
                value={credentials.email}
                onChange={handleInputChange}
            />

            <label className="input-label">Password</label>
            <input
                type="password"
                name="password"
                required
                className="input"
                value={credentials.password}
                onChange={handleInputChange}
            />

            <br></br>
            <input
                type="submit"
                value="Login"
                className="button green-button"
            />
            <input
                type="button"
                value="Register"
                className="button blue-button"
                style={{ marginTop: "10px" }}
                onClick={(event) => {
                    event.preventDefault();
                    register();
                }}
            />
        </form>
    );
};

export default LoginForm;
