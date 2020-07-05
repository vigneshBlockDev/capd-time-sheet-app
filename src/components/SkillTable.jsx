import React, { Component } from 'react';
import { Table, FormGroup, Label, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import SkillForm from './SkillForm';

class SkillTable extends Component {
    state = {
        Skills: null,
        showModal: false,
        editSkillData: null,
        openForm: false,
        searchquery: '',
        filteredSkills: [],
    }
    getSkills = async () => {
        try {
            let response = await fetch(`http://localhost:4000/api/getskills`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            response = await response.json();
            console.log(response);
            this.setState({ Skills: response.data });
        } catch (error) {
            console.log(error);
        }
    }
    componentDidMount() {
        this.setState({}, () => this.getSkills());
    }
    handleDelete = async (deletSkill) => {
        // /api/deleteresources
        try {
            let response = await fetch(`http://localhost:4000/api/deleteskill`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ skill: deletSkill }),
            });
            response = await response.json();
            this.getSkills();
        } catch (error) {
            console.log(error);
        }
    }
    backNavigation = () => {
        this.setState({openForm: false }, () => this.getSkills());
    }

    handleEdit = (editSkill) => {
        this.setState({ editSkillData: editSkill, openForm: true });
    }
    handleCreateuser = () => {
        this.setState({ openForm: true });
    }
    handleListUser = () => {
        this.setState({editSkillData:null, openForm: false });
    }
    handleSearch = (e) => {
        let { Skills } = this.state;
        let searchquery = e.target.value;
        if (!searchquery) {
            this.setState({ Skills, searchquery, filteredSkills: [] });
            return;
        }
        let filteredSkills = Skills.filter((skill) => skill.Skill_Name.toLowerCase().startsWith(searchquery.toLowerCase()));
        console.log(filteredSkills);
        this.setState({ filteredSkills: filteredSkills, searchquery });
    }
    getSearchData = () => {
        const { Skills, filteredSkills } = this.state;
        if (filteredSkills.length > 0) {
            return {
                Skills: filteredSkills,
            }
        } else {
            return {
                Skills,
            }
        }
    }
    render() {
        const { openForm, editSkillData, searchquery } = this.state;
        const { Skills } = this.getSearchData();
        console.log(Skills);
        return (
            <React.Fragment>
                {!openForm &&
                    <React.Fragment>
                        <Button color="primary m-5" onClick={this.handleCreateuser}>Create New Skill</Button>
                        <FormGroup>
                            <Label for="SearchResources">Search Skill</Label>
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
                {openForm && <Button color="primary m-5" onClick={this.handleListUser}>List Skill</Button>}
                {!openForm ? <Table dark>
                    <thead>
                        <tr>
                            <th>Skill_ID</th>
                            <th>Skill_Name</th>
                            <th>Delete</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Skills && Skills.map((skill, index) => (
                            <tr key={index} >
                                <th scope="row">{skill.Skill_ID}</th>
                                <td>{skill.Skill_Name}</td>
                                <td ><AiFillDelete onClick={() => this.handleDelete(skill)} /></td>
                                <td ><AiFillEdit onClick={() => this.handleEdit(skill)} /></td>
                                
                            </tr>
                        ))}
                    </tbody>
                </Table> : <SkillForm skill={editSkillData} back={this.backNavigation} />}
            </React.Fragment>
        );
    }
}

export default SkillTable;
