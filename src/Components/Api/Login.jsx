import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../Common/toast.jsx';

const apiLink = process.env.REACT_APP_API_LINK;

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const login = async () => {
        console.log("Logging in");
        console.log(credentials);
        try {
            const response = await fetch(`${apiLink}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Logged in');
                Toast('Logged in');
                navigate('/');
            } else {
                Toast(result.errors.detail);
            }
        } catch (error) {
            console.log('Network error', error);
        }
    };

    const register = async () => {
        console.log("Registering");
        console.log(credentials);
        try {
            const response = await fetch(`${apiLink}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Toast('Successfully Registered');
                login();
            } else {
                Toast(result.errors.detail)
            }
        } catch (error) {
            console.log('Network error', error);
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
            <label className="input-label">
                Email
                <input
                    type="email"
                    name="email"
                    required
                    className="input"
                    value={credentials.email}
                    onChange={handleInputChange}
                />
            </label>
            <label className="input-label">
                Lösenord
                <input
                    type="password"
                    name="password"
                    required
                    className="input"
                    value={credentials.password}
                    onChange={handleInputChange}
                />
            </label>
            <input type="submit" value="Logga in" className="button green-button" />
            <input
                type="button"
                value="Registrera"
                className="button blue-button"
                style={{ marginTop: '10px' }}
                onClick={(event) => {
                    event.preventDefault();
                    register();
                }}
            />
        </form>
    );
};

export default LoginForm;