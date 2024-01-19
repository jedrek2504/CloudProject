// Navbar.js
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';

const Navbar = ({ signOut }) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-5">
        <a className="navbar-brand" href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="40" height="40"><path d="M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z" style={{ fill: 'white' }}/></svg> CloudProject</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#">About & Authors</a>
                </li>
            </ul>
        </div>
        <button type="button" className="btn btn-danger ml-auto" onClick={signOut}>Sign out</button>
    </nav>
);

export default Navbar;
