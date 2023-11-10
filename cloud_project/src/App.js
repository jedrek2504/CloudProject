import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import './App.css';
import { Authenticator, Button, Flex, Text, View, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const myAPI = "cloudprojectapi";
const path = '/items';

const App = () => {
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(undefined);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const apiResponse = await API.get(myAPI, path);
            setItems(apiResponse);
        } catch (error) {
            console.error('Error fetching items from S3', error);
        }
    };

    const uploadFile = async () => {
        try {
            if (file) {
                const result = await Storage.put(file.name, file);
                console.log(result);
                fetchItems(); // To refresh the list after upload
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const deleteFile = async (key) => {
        try {
            await Storage.remove(key);
            fetchItems(); // To refresh the list after delete
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const downloadFile = async (key) => {
        try {
            const file = await Storage.get(key, { download: true });
            window.location.href = file; // This will download the file
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
                <View className="App">
                    <Flex direction="column" alignItems="center" justifyContent="center">
                        <Text variant="h1">Cloud Project S3 Bucket Contents</Text>
                        <input type="file" onChange={onFileChange} />
                        <Button onClick={uploadFile}>Upload</Button>
                        {items.length > 0 ? (
                            <ul>
                                {items.map((item, index) => (
                                    <li key={index}>
                                        Key: {item.key}, Size: {item.size}
                                        <Button onClick={() => downloadFile(item.key)}>Download</Button>
                                        <Button onClick={() => deleteFile(item.key)}>Delete</Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Text>No items in S3 bucket to display.</Text>
                        )}
                        <Button onClick={signOut}>Sign Out</Button>
                    </Flex>
                </View>
            )}
        </Authenticator>
    );
};

export default withAuthenticator(App);
