import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "../Common/toast.jsx";

const apiKey = process.env.REACT_APP_API_LINK;

const FetchDoc = () => {
    const { id } = useParams();
    const [docs, setDocs] = useState(null);
    const [shareEmail, setShareEmail] = useState("");
    const navigate = useNavigate();
    const xAccessToken = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        if (!user && user.email && xAccessToken) {
            navigate("/login");
            toast("Please log in to access your documents.");
            return;
        }
        let socket = io(process.env.REACT_APP_API_LINK);

        fetch(apiKey + `/docs/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data.users.includes(user.email)) {
                    socket.emit("create", data.data._id);
                    setDocs(data.data); // Accessing the array inside the `data` property
                } else {
                    toast("You do not have access to this document.");
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                }
            })
            .catch((err) => console.error("Error fetching data:", err));

        return () => {
            console.log("Disconnecting socket...");
            socket.disconnect();
        };
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDocs((prevDocs) => ({
            ...prevDocs, // Keep the existing values
            [name]: value, // Update the value of the changed field (title or content)
        }));
    };

    // Handle form submission for PUT request
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + `/docs/${id}`, {
            method: "PUT", // Use PUT method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
            body: JSON.stringify(docs), // Send the updated document data as JSON
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    navigate("/");
                } else {
                    toast("Failed to update document.");
                }
            })
            .catch((err) => console.error("Error updating document:", err));
    };

    const handleDelete = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + `/docs/${id}`, {
            method: "DELETE", // Use DELETE method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    navigate("/");
                } else {
                    toast("Failed to delete document.");
                }
            })
            .catch((err) => console.error("Error deleting document:", err));
    };

    const handleShareChange = (e) => {
        setShareEmail(e.target.value);
    };

    const handleShare = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + `/docs/${id}/share`, {
            method: "POST", // Use POST method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
            body: JSON.stringify({ user: user.email, addEmail: shareEmail }), // Send the email to share the document with
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    toast("Document shared successfully.");
                } else {
                    toast("Failed to share document.");
                }
            })
            .catch((err) => console.error("Error sharing document:", err));
    };

    return (
        <div>
            <ul>
                {docs ? (
                    <div>
                        <form onSubmit={handleSubmit} className="new-doc">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={docs.title}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="content">Content</label>
                            <textarea
                                name="content"
                                value={docs.content}
                                onChange={handleInputChange}
                            />
                            <input
                                className="blue-button"
                                type="submit"
                                value="Apply Changes"
                            />
                        </form>

                        <form onSubmit={handleDelete} className="delete-doc">
                            <input
                                className="red-button"
                                type="submit"
                                value="Delete Document"
                            />
                        </form>

                        <form onSubmit={handleShare} className="share-doc">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={docs.email}
                                onChange={handleShareChange}
                                required
                            />
                            <input
                                className="green-button"
                                type="submit"
                                value="Share Document"
                            />
                        </form>
                    </div>
                ) : (
                    <h3>Loading...</h3>
                )}
            </ul>
        </div>
    );
};

export default FetchDoc;
