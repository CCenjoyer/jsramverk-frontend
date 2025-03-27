import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const apiKey = process.env.REACT_APP_API_LINK;

const CreateDoc = () => {
    const [newDoc, setNewDoc] = useState({
        title: "",
        content: "",
    });
    const navigate = useNavigate();
    const xAccessToken = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        if (user === null || xAccessToken === null) {
            navigate("/login");
            return;
        }
    }, [user, xAccessToken, navigate]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoc((prevDoc) => ({
            ...prevDoc, // Keep the existing values
            [name]: value, // Update the value of the changed field (title or content)
        }));
    };

    // Handle form submission for POST request
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + "/docs", {
            method: "POST", // Use POST method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
            body: JSON.stringify({ ...newDoc, users: [user.email] }), // Send the new document data as JSON
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    navigate("/"); // Navigate back to the homepage or documents list
                } else {
                    alert("Failed to create document.");
                }
            })
            .catch((err) => console.error("Error creating document:", err));
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="new-doc">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={newDoc.title}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="content">Content:</label>
                <textarea
                    name="content"
                    id="content"
                    value={newDoc.content}
                    onChange={handleInputChange}
                />

                <input
                    className="green-button"
                    type="submit"
                    value="Create Document"
                />
            </form>
        </div>
    );
};

export default CreateDoc;
