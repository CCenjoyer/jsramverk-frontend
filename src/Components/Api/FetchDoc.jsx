import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

const FetchDoc = () => {
    const { id } = useParams();
    const [docs, setDocs] = useState(null);

    useEffect(() => {
        fetch(`https://jsramverk-josf23-gtdeabgchjdefsgb.swedencentral-01.azurewebsites.net/docs/${id}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data); // Inspect the data structure
            if (data.success) {
                setDocs(data.data); // Accessing the array inside the `data` property
            } else {
                setDocs([]); // Default to empty array if not an array
            }
        })
        .catch((err) => console.error("Error fetching data:", err));
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDocs((prevDocs) => ({
            ...prevDocs,  // Keep the existing values
            [name]: value  // Update the value of the changed field (title or content)
        }));
    };

    return (
        <div>
            <ul>
                {docs ? (
                    <div>   
                    <form method="POST" action="/create" class="new-doc">
                        <label for="title">Title:</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={docs.title} 
                            onChange={handleInputChange}
                        />
                
                        <label for="content">Content</label>
                        <textarea 
                            name="content" 
                            value={docs.content}
                            onChange={handleInputChange}
                        />
                
                        <input type="submit" value="Create" />
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
