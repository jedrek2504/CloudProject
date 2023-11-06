// App.js

import React, { useState } from 'react';
import Amplify, { API } from 'aws-amplify';
import './App.css';

Amplify.configure({
    // Your Amplify configuration goes here
});

const myAPI = "cloudprojectapi";
const path = '/items'; // The path set up in your REST API

const App = () => {
    const [message, setMessage] = useState("");

    // Function to fetch a message from our backend
    const fetchMessage = () => {
        API.get(myAPI, path)
            .then(response => {
                console.log(response);
                setMessage(response); // Assuming the response is just a simple string
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="App">
            <h1>Connect Front to Back</h1>
            <button onClick={fetchMessage}>Fetch Message</button>
            {message && (
                <p>Response from backend: {message}</p>
            )}
        </div>
    );
};

export default App;