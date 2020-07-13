import React from 'react';
import { FaUserAstronaut, FaProjectDiagram } from 'react-icons/fa';
import { FiLogOut, FiLogIn } from 'react-icons/fi';

const NavBar = () => {
    return (
        <React.Fragment>
            <nav className="navbar navbar-dark m-5 bg-dark">
                <a className="navbar-brand" href="/ResourceDetails"> <span><FaUserAstronaut /><p>User Table</p></span></a>
                <a className="navbar-brand" href="/ProjectDetails">   <span><FaProjectDiagram /><p>Project Table</p></span></a>
                <a className="navbar-brand" href="/SkillDetails">   <span><FaProjectDiagram /><p>Skill Table</p></span></a>
                <a className="navbar-brand" href="/login"> {localStorage.getItem('login') == 'true' ? <span><FiLogOut /><p>Logout</p></span> : <span><FiLogIn /><p>Login</p></span>}</a>
            </nav>
        </React.Fragment>
    );
}

export default NavBar;