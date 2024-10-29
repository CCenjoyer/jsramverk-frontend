import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
const apiKey = process.env.REACT_APP_API_LINK;
const toast = require('../Common/toast.js');

const FetchDoc = () => {
    const { id } = useParams();
    const [docs, setDocs] = useState(null);
    const navigate = useNavigate();
    const xAccessToken = sessionStorage.getItem('token');

    useEffect(() => {
        console.log("Making GET request to fetch document with ID:", id, "and token:", xAccessToken);
        fetch(apiKey + `/docs/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken
        }
    }).then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setDocs(data.data); // Accessing the array inside the `data` property
            } else {
                setDocs([]); // Default to empty array if not an array
            }
        })
        .catch((err) => console.error("Error fetching data:", err));
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDocs((prevDocs) => ({
            ...prevDocs,  // Keep the existing values
            [name]: value  // Update the value of the changed field (title or content)
        }));
    };

    // Handle form submission for PUT request
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + `/docs/${id}`, {
            method: "PUT", // Use PUT method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken
            },
            body: JSON.stringify(docs) // Send the updated document data as JSON
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                navigate('/');
            } else {
                toast('Failed to update document.');
            }
        })
        .catch((err) => console.error("Error updating document:", err));
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
                        />
                
                        <label htmlFor="content">Content</label>
                        <textarea 
                            name="content" 
                            value={docs.content}
                            onChange={handleInputChange}
                        />
                
                        <input type="submit" value="Apply Changes" />
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
