import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const myAPI = "cloudprojectapi";
const path = '/items'; // The path set up in your REST API

const App = () => {
    const [items, setItems] = useState([]);

    // Function to fetch items from our backend
    const fetchItems = async () => {
        try {
            const apiResponse = await API.get(myAPI, path);
            const itemList = JSON.parse(apiResponse); // parsing the response because it's a JSON string
            setItems(itemList);
        } catch (error) {
            console.error('Error fetching items from S3', error);
        }
    };

    useEffect(() => {
        fetchItems(); // Fetch items when the component mounts
    }, []);

    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div className="App">
                    <h1>Cloud Project S3 Bucket Contents</h1>
                    {items.length > 0 ? (
                        <ul>
                            {items.map((item, index) => (
                                <li key={index}>
                                    Key: {item.key}, Size: {item.size}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No items in S3 bucket to display.</p>
                    )}
                    {user && <button onClick={signOut}>Sign Out</button>}
                </div>
            )}
        </Authenticator>
    );
};

export default App;
