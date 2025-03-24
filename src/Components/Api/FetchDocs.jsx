import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const apiKey = process.env.REACT_APP_API_LINK;

const FetchDocs = () => {
    const [docs, setDocs] = useState([]);
    const xAccessToken = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        if (user && user.email) {
            console.log(user);
            fetch(`${apiKey}/docs/email/${user.email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": xAccessToken,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data); // Inspect the data structure
                    if (data.success && Array.isArray(data.data)) {
                        setDocs(data.data); // Accessing the array inside the `data` property
                    } else {
                        setDocs([]); // Default to empty array if not an array
                    }
                })
                .catch((err) => console.error("Error fetching data:", err));
        }
    }, []);

    return (
        <div>
            <ul>
                {docs.length > 0 ? (
                    docs.map((doc) => (
                        <li key={doc._id}>
                            <h3>
                                <Link to={`/document/${doc._id}`}>
                                    {doc.title}
                                </Link>
                            </h3>
                        </li>
                    ))
                ) : user ? (
                    <h3>Loading...</h3>
                ) : (
                    <h3>Please log in to view documents.</h3>
                )}
            </ul>
        </div>
    );
};

export default FetchDocs;
