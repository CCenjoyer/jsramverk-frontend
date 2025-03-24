import React from "react";
import { useParams } from "react-router-dom";
import FetchDoc from "../Api/FetchDoc.jsx";

function Document() {
    const { id } = useParams();
    return (
        <div>
            <h1>Edit Entry {id}</h1>
            <FetchDoc />
        </div>
    );
}

export default Document;
