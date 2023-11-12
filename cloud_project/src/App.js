import React, { useState, useEffect } from 'react';
import { API, Storage, Auth } from 'aws-amplify';
import './App.css';
import { Authenticator, Button, Flex, Text, View, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import HomePage from './view/HomePage';

const myAPI = "cloudprojectapi";
const path = '/items';

const App = () => {
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(undefined);
    const [downloadedImageUrl, setDownloadedImageUrl] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const identityId = (await Auth.currentUserCredentials()).identityId;
            console.log("Cognito Identity ID in React app:", identityId);
            const token = (await Auth.currentSession()).getIdToken().getJwtToken();
            const apiResponse = await API.get(myAPI, path, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Identity-Id': identityId, // Pass the identityId as a custom header
                },
            });
            console.log(apiResponse);
            setItems(apiResponse);
        } catch (error) {
            console.error('Error fetching items from S3', error);
        }
    };

    const uploadFile = async () => {
        try {
            const identityId = (await Auth.currentUserCredentials()).identityId;
            if (file) {
                const result = await Storage.put(file.name, file, {
                    metadata: {
                        owner: identityId, // Set the owner metadata
                    },
                });
                console.log(result);
                fetchItems(); // To refresh the list after upload
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const deleteFile = async (key) => {
        console.log(`Attempting to delete file with key: ${key}`); // Debugging log
        try {
            await Storage.remove(key);
            console.log(`File deleted successfully: ${key}`); // Confirm deletion
            fetchItems(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };


    const downloadFile = async (key) => {
        console.log(`Attempting to download file with key: ${key}`); // Add this line
        try {
            const file = await Storage.get(key, { expires: 60 });
            console.log(file);
            setDownloadedImageUrl(file);
            //window.location.href = file; // This will download the file
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };


    const onFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    return (
        <Authenticator>
            {({ signOut }) => (
                <HomePage
                    items={items}
                    onFileChange={onFileChange}
                    uploadFile={uploadFile}
                    downloadFile={downloadFile}
                    deleteFile={deleteFile}
                    signOut={signOut}
                    downloadedImageUrl={downloadedImageUrl}
                />
            )}
        </Authenticator>
    );
};

export default withAuthenticator(App);
