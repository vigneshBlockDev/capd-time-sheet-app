import React, { Component } from 'react';
import { Table, FormGroup, Label, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import ProjectForm from './projectForm';
import NavBar from './NavBar';

class ProjectTable extends Component {
    state = {
        users: null,
        showModal: false,
        editUserData: null,
        openForm: false,
        searchquery: '',
        filteredUsers: [],
    }
    getUsers = async () => {
        try {
            let response = await fetch(`http://localhost:4000/api/getprojects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            response = await response.json();
            console.log(response);
            this.setState({ users: response.data });
        } catch (error) {
            console.log(error);
        }
    }
    componentDidMount() {
        this.setState({ editUserData: '' }, () => this.getUsers());
    }
    handleDelete = async (deleteUser) => {
        // /api/deleteresources
        try {
            let response = await fetch(`http://localhost:4000/api/deleteproject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project: deleteUser }),
            });
            response = await response.json();
            this.getUsers();
        } catch (error) {
            console.log(error);
        }
    }
    backNavigation = () => {
        this.setState({ openForm: false }, () => this.getUsers());
    }

    handleEdit = (editUser) => {
        this.setState({ editUserData: editUser, openForm: true });
    }
    handleCreateuser = () => {
        this.setState({ openForm: true });
    }
    handleListUser = () => {
        this.setState({ editSkillData: null, openForm: false });
    }
    handleSearch = (e) => {
        let { users } = this.state;
        let searchquery = e.target.value;
        if (!searchquery) {
            this.setState({ users, searchquery, filteredUsers: [] });
            return;
        }
        let filteredUsers = users.filter((user) => user.Project_Name.toLowerCase().startsWith(searchquery.toLowerCase()));
        console.log(filteredUsers);
        this.setState({ filteredUsers: filteredUsers, searchquery });
    }
    getSearchData = () => {
        const { users, filteredUsers } = this.state;
        if (filteredUsers.length > 0) {
            return {
                users: filteredUsers,
            }
        } else {
            return {
                users,
            }
        }
    }
    render() {
        const { openForm, editUserData, searchquery } = this.state;
        const { users } = this.getSearchData();
        console.log(users);
        return (
            <React.Fragment>
                <NavBar />
                {!openForm &&
                    <React.Fragment>
                        {localStorage.getItem('isAdmin') === 'true' && <Button color="primary m-5" onClick={this.handleCreateuser}>Create New Project</Button>}
                        <FormGroup>
                            <Label for="SearchResources">Search Project</Label>
                            <Input
                                id="SearchResources"
                                name="SearchResources"
                                type="text"
                                onChange={(e) => this.handleSearch(e)}
                                value={searchquery}
                                className="w-25"

                            />
                        </FormGroup>
                    </React.Fragment>
                }
                {openForm && <Button color="primary m-5" onClick={this.handleListUser}>List Project</Button>}
                {!openForm ? <Table dark>
                    <thead>
                        <tr>
                            <th>Project_ID</th>
                            <th>Project_Code</th>
                            <th>Project_Name</th>
                            {localStorage.getItem('isAdmin') === 'true' &&
                                <React.Fragment>
                                    <th>Delete</th>
                                    <th>Edit</th>
                                </React.Fragment>}
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user, index) => (
                            <tr key={index} >
                                <th scope="row">{user.Project_ID}</th>
                                <td>{user.Project_Code}</td>
                                <td>{user.Project_Name}</td>
                                {localStorage.getItem('isAdmin') === 'true' &&
                                    <React.Fragment>
                                        <td ><AiFillDelete onClick={() => this.handleDelete(user)} /></td>
                                        <td ><AiFillEdit onClick={() => this.handleEdit(user)} /></td>
                                    </React.Fragment>}

                            </tr>
                        ))}
                    </tbody>
                </Table> : <ProjectForm project={editUserData} back={this.backNavigation} />}
            </React.Fragment>
        );
    }
}

export default ProjectTable;
