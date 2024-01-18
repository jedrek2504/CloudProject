import React from 'react';
import {Flex, Text, View, Button} from '@aws-amplify/ui-react';
import Navbar from './NavBar';

const HomePage = ({items, onFileChange, handleUpload, downloadFile, deleteFile, signOut, downloadedImageUrl, toggleVersionHistory, versionHistoryVisible}) => (
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
                            Key: {item.key}
                            <Button onClick={() => downloadFile(item.key, item.versionId)}>Download</Button>
                            <Button onClick={() => deleteFile(item.key, item.versionId)}>Delete</Button>
                            <Button onClick={() => toggleVersionHistory(item.key)}>History</Button>
                            {versionHistoryVisible[item.key] && (
                                <ul>
                                    {item.versions.map((version, versionIndex) => (
                                        <li key={versionIndex}>
                                            Version: {version.versionId}, Size: {version.size}, Last
                                            Modified: {version.lastModified}
                                        </li>
                                    ))}
                                </ul>
                            )}
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
