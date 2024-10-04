import React, { Fragment } from "react";
import FetchDocs from "./Api/FetchDocs";

function Home() {
    return (
        <Fragment>
            <h1>Welcome to Docs Page!</h1>
            <FetchDocs />
        </Fragment>
    );
}

export default Home;
