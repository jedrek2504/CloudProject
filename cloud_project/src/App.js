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

    const deleteFile = async (key, versionId) => { // Add versionId parameter
        console.log(`Attempting to delete file with key: ${key} and versionId: ${versionId}`); // Debugging log
        try {
            const deleteParams = {
                Key: key
            };
            if (versionId) deleteParams.VersionId = versionId; // Add the versionId to the delete parameters if provided
            await Storage.remove(key, { deleteParams });
            console.log(`File deleted successfully: ${key} version: ${versionId}`); // Confirm deletion
            fetchItems(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const downloadFile = async (key, versionId) => {
        try {
            const signedUrl = await Storage.get(key, {
                versionId: versionId, // Specify the versionId for the download
                expires: 60 // URL expires in 60 seconds
            });
            const downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            downloadLink.href = signedUrl;
            downloadLink.target = '_blank';
            downloadLink.download = key;
            downloadLink.click();
            document.body.removeChild(downloadLink);
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
