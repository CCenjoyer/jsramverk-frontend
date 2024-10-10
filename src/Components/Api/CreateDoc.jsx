import { useState } from "react";
import { useNavigate } from 'react-router-dom';
const apiKey = process.env.REACT_APP_API_LINK;

const CreateDoc = () => {
    const [newDoc, setNewDoc] = useState({
        title: "",
        content: ""
    });
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoc((prevDoc) => ({
            ...prevDoc,  // Keep the existing values
            [name]: value  // Update the value of the changed field (title or content)
        }));
    };

    // Handle form submission for POST request
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + '/docs', {
            method: "POST", // Use POST method
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDoc) // Send the new document data as JSON
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                navigate('/'); // Navigate back to the homepage or documents list
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
                    value={newDoc.title} 
                    onChange={handleInputChange}
                    required // Mark field as required
                />
        
                <label htmlFor="content">Content:</label>
                <textarea 
                    name="content" 
                    value={newDoc.content}
                    onChange={handleInputChange}
                    required // Mark field as required
                />
        
                <input type="submit" value="Create Document" />
            </form>
        </div>
    );
};

export default CreateDoc;
