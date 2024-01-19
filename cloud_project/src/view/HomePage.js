import React from 'react';
import { Flex, Text, View, Button } from '@aws-amplify/ui-react';
import Navbar from './NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HomePage = ({ items, onFileChange, handleUpload, downloadFile, deleteFile, signOut, downloadedImageUrl, toggleVersionHistory, versionHistoryVisible }) => (
    <View className="App">
        <Navbar signOut={signOut} />
        <div className='container-fluid'>
            <div className='text-center mb-3' style={{ fontWeight: 'bold', fontSize: "2.5em", textShadow: "1px 1px 1px #000000" }}>
                Your private cloud space
            </div>
            <input type="file" multiple onChange={onFileChange} />
            <Button className='btn btn-success' onClick={handleUpload}>Upload</Button>
            {items.length > 0 ? (
                <div className='container mt-5'>
                    {chunkArray(items, 3).map((row, rowIndex) => (
                        <div key={rowIndex} className="row justify-content-between">
                            {row.map((item, index) => (
                                <div key={index} className="col-3 bg-light rounded shadow pt-4 pb-2" style={{ marginBottom: '20px' }}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="80" height="80"><path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z" /></svg>
                                    </div>
                                    <div className='text-center' style={{ fontWeight: 'bold', fontSize: "1.2em" }}>
                                        {item.key.length > 20 ? `${item.key.slice(0, 20)}...` : item.key}
                                    </div>

                                    <div className='row py-2 px-4 justify-content-between'>
                                        <Button className='btn btn-primary col-3' onClick={() => downloadFile(item.key, item.versionId)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" style={{ fill: 'white' }}/></svg></Button>
                                        <Button className='btn btn-danger col-3' onClick={() => deleteFile(item.key, item.versionId)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" style={{ fill: 'white' }}/></svg></Button>
                                        <Button className='btn btn-warning col-3' onClick={() => toggleVersionHistory(item.key)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" style={{ fill: 'white' }}/></svg></Button>
                                    </div>
                                    {versionHistoryVisible[item.key] && (
                                        <Flex direction="column" alignItems="center">
                                            {item.versions.map((version, versionIndex) => (
                                                <div key={versionIndex} style={{ marginBottom: '10px' }}>
                                                    <Text>Version: {version.versionId}</Text>
                                                    <Text>Size: {version.size}</Text>
                                                    <Text>Last Modified: {version.lastModified}</Text>
                                                </div>
                                            ))}
                                        </Flex>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <Text>No items in S3 bucket to display.</Text>
            )}
            {downloadedImageUrl && <img src={downloadedImageUrl} alt="Downloaded Image" />}
        </div>
    </View>
);

// Function to chunk an array into groups of a specified size
const chunkArray = (arr, size) => {
    return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
};

export default HomePage;