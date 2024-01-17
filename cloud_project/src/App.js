import React, {useState, useEffect} from 'react';
import {API, Storage, Auth} from 'aws-amplify';
import './App.css';
import {Authenticator, withAuthenticator} from '@aws-amplify/ui-react';
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
            const token = (await Auth.currentSession()).getIdToken().getJwtToken();
            const apiResponse = await API.get(myAPI, path, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Identity-Id': identityId,
                },
            });
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
                        owner: identityId,
                    },
                });
                fetchItems(); // To refresh the list after upload
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const deleteFile = async (key, versionId) => {
        try {
            await Storage.remove(key, {versionId});
            fetchItems(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const downloadFile = async (key, versionId) => {
        try {
            const url = await Storage.get(key, {
                versionId,
                expires: 60 // URL expires in 60 seconds
            });
            setDownloadedImageUrl(url);
            // window.location.href = url; // This will download the file
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <Authenticator>
            {({signOut}) => (
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
