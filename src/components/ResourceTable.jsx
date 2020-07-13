import React, { Component } from 'react';
import { Table, FormGroup, Label, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import UserForm from './userForm';
import NavBar from './NavBar';

class ResourceTable extends Component {
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
            let response = await fetch(`http://localhost:4000/api/getresources`, {
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
        this.getUsers();
    }
    handleDelete = async (deleteUser) => {
        // /api/deleteresources
        try {
            let response = await fetch(`http://localhost:4000/api/deleteresources`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: deleteUser }),
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
        let filteredUsers = users.filter((user) => user.Resource_Name.toLowerCase().startsWith(searchquery.toLowerCase()));
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
                        {localStorage.getItem('isAdmin') === 'true' && <Button color="primary m-5" onClick={this.handleCreateuser}>Create New User</Button>}
                        <FormGroup>
                            <Label for="SearchResources">Search Resource</Label>
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
                {openForm && <Button color="primary m-5" onClick={this.handleListUser}>List User</Button>}
                {!openForm ? <Table dark>
                    <thead>
                        <tr>
                            <th>Resource_ID</th>
                            <th>Resource_Name</th>
                            <th>SOW_Category</th>
                            <th>Billing_Type</th>
                            <th>City</th>
                            <th>Shore</th>
                            <th>Skill_Set</th>
                            {localStorage.getItem('isAdmin') === 'true' && <React.Fragment><th>Delete</th>
                                <th>Edit</th></React.Fragment>}
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user, index) => (
                            <tr key={index} >
                                <th scope="row">{user.Resource_ID}</th>
                                <td>{user.Resource_Name}</td>
                                <td>{user.SOW_Category}</td>
                                <td>{user.Billing_Type}</td>
                                <td>{user.City}</td>
                                <td>{user.Shore}</td>
                                <td>{user.Skill_Set}</td>
                                {localStorage.getItem('isAdmin') === 'true' && <React.Fragment>  <td ><AiFillDelete onClick={() => this.handleDelete(user)} /></td>
                                    <td ><AiFillEdit onClick={() => this.handleEdit(user)} /></td>  </React.Fragment>}
                            </tr>
                        ))}
                    </tbody>
                </Table> : <UserForm user={editUserData} back={this.backNavigation} />}
            </React.Fragment>
        );
    }
}

export default ResourceTable;
