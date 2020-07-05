import React from 'react';
import { FaUserAstronaut, FaProjectDiagram } from 'react-icons/fa';

const NavBar = () => {
    return (
        <React.Fragment>
            <nav className="navbar navbar-dark m-5 bg-dark">
                <a className="navbar-brand" href="/ResourceDetails"> <span><FaUserAstronaut /><p>User Table</p></span></a>
                <a className="navbar-brand" href="/ProjectDetails">   <span><FaProjectDiagram /><p>Project Table</p></span></a>
                <a className="navbar-brand" href="/SkillDetails">   <span><FaProjectDiagram /><p>Skill Table</p></span></a>
            </nav>
        </React.Fragment>
    );
}

export default NavBar;