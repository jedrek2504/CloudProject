// App.js

import React, { useState } from 'react';
import { API } from 'aws-amplify';
import './App.css';
import {Authenticator} from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';


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
        <Authenticator>
            {({signOut}) => (
                <div className="App">
                    <h1>Connect Front to Back</h1>
                    <button onClick={fetchMessage}>Fetch Message</button>
                    {message && (
                        <p>Response from backend: {message}</p>
                    )}
                    <button onClick={signOut}>Sign Out</button>`
                </div>
            )}
        </Authenticator>
    );
};

export default App;