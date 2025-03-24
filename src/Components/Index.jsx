import React, { Fragment } from "react";
import FetchDocs from "./Api/FetchDocs";

function Home() {
    return (
        <Fragment>
            <h1>Documents</h1>
            <FetchDocs />
        </Fragment>
    );
}

export default Home;
