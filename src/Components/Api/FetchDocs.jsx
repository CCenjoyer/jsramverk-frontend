import { useState, useEffect } from "react";
const apiKey = process.env.REACT_APP_API_LINK;

const FetchDocs = () => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        fetch(apiKey + "/docs")
        .then((res) => res.json())
        .then((data) => {
            console.log(data); // Inspect the data structure
            if (data.success && Array.isArray(data.data)) {
                setDocs(data.data); // Accessing the array inside the `data` property
            } else {
                setDocs([]); // Default to empty array if not an array
            }
        })
        .catch((err) => console.error("Error fetching data:", err));
    }, []);

    return (
        <div>
            <ul>
                {docs.length > 0 ? (
                    docs.map((doc) => (
                        <li key={doc._id}>
                            <h3>
                                <a href={`/update/${doc._id}`}>Document Title: {doc.title}</a>
                            </h3>
                        </li>
                    ))
                ) : (
                    <h3>Loading...</h3>
                )}
            </ul>
        </div>
    );
};

export default FetchDocs;
