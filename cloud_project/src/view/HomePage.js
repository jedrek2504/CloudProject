import React from 'react';
import {Flex, Text, View, Button} from '@aws-amplify/ui-react';
import Navbar from './NavBar';

const HomePage = ({items, onFileChange, handleUpload, downloadFile, deleteFile, signOut, downloadedImageUrl}) => (
    <View className="App">
        <Navbar signOut={signOut}/>
        <Flex direction="column" alignItems="center" justifyContent="center">
            <Text variant="h1">Cloud Project S3 Bucket Contents</Text>
            <input type="file" multiple onChange={onFileChange}/>
            <Button onClick={handleUpload}>Upload</Button>
            {items.length > 0 ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            Key: {item.key}, Size: {item.size}, Last
                            Modified: {new Date(item.lastModified).toLocaleString()}
                            <Button onClick={() => downloadFile(item.key, item.versionId)}>Download</Button>
                            <Button onClick={() => deleteFile(item.key, item.versionId)}>Delete</Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <Text>No items in S3 bucket to display.</Text>
            )}
            {downloadedImageUrl && <img src={downloadedImageUrl} alt="Downloaded Image"/>}
            <Button onClick={signOut}>Sign Out</Button>
        </Flex>
    </View>
);

export default HomePage;
