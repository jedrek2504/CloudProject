// Navbar.js
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';

const Navbar = ({ signOut }) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-5">
        <a className="navbar-brand" href="#">CloudProject</a>
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
