import React from "react";
import AppRouter from "./Routes/AppRouter";

function App() {
    return (
        <div className="App">
            <AppRouter />
            <div className="toast">
                <div className="toast-body"></div>
            </div>
        </div>
    );
}

export default App;
