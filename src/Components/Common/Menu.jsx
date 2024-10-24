import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Menu() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Listen for custom event
        const handleUserLoggedIn = () => {
            const updatedUser = sessionStorage.getItem('user');
            if (updatedUser) {
                setUser(JSON.parse(updatedUser));
            }
        };

        window.addEventListener('userLoggedIn', handleUserLoggedIn);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('userLoggedIn', handleUserLoggedIn);
        };
    }, []);

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <div>
            <h1>SSR Editor</h1>
            <nav>
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/create'}>Create Doc</Link></li>
                    {user ? (
                        <li className="login-nav">
                            <Link to={'/'} onClick={logout}>Logout user({user.email})</Link>
                        </li>
                    ) : (
                        <li className="login-nav"><Link to={'/login'}>Login</Link></li>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Menu;