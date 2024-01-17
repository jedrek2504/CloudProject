import React, {useState, useEffect} from 'react';
import {API, Storage, Auth} from 'aws-amplify';
import './App.css';
import {Authenticator, Button, withAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import HomePage from './view/HomePage';
import JSZip from 'jszip';

const myAPI = "cloudprojectapi";
const path = '/items';

const App = () => {
    const [items, setItems] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [downloadedImageUrl, setDownloadedImageUrl] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const identityId = (await Auth.currentUserCredentials()).identityId;
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        const apiResponse = await API.get(myAPI, path, {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Identity-Id': identityId,
            },
        });
        const formattedItems = apiResponse.map(item => ({
            ...item,
            lastModified: new Date(item.lastModified).toLocaleString() // Display formatted date
        }));
        setItems(formattedItems);
    };

    const handleUpload = async () => {
        const identityId = (await Auth.currentUserCredentials()).identityId;
        if (selectedFiles.length > 1) {
            const zip = new JSZip();
            for (const file of selectedFiles) {
                zip.file(file.name, file);
            }
            const content = await zip.generateAsync({type: "blob"});
            await Storage.put(`archive-${Date.now()}.zip`, content, {
                metadata: {owner: identityId}
            });
        } else {
            const file = selectedFiles[0];
            await Storage.put(file.name, file, {
                metadata: {owner: identityId}
            });
        }
        fetchItems();
    };

    const deleteFile = async (key) => {
        try {
            await Storage.remove(key);
            fetchItems();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const downloadFile = async (key) => {
        try {
            const url = await Storage.get(key, {expires: 60}); // URL expires in 60 seconds
            setDownloadedImageUrl(url);
            // window.location.href = url; // This will download the file
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const onFileChange = (e) => {
        setSelectedFiles(e.target.files); // Update the state with the selected files
    };

    return (
        <Authenticator>
            {({signOut}) => (
                <HomePage
                    items={items}
                    onFileChange={onFileChange}
                    handleUpload={handleUpload}
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
