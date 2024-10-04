import React, { Fragment } from "react";
import FetchDocs from "./Api/FetchDocs";

function Home() {
    return (
        <Fragment>
            <h1>Welcome to Home Page!</h1>
            <h3>How to deploy a React app to a subdirectory?</h3>
            <FetchDocs />
        </Fragment>
    );
}

export default Home;
