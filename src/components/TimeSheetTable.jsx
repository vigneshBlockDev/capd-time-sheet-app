import React, { Component } from 'react';
import { Table, FormGroup, Label, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import SkillForm from './SkillForm';

class SkillTable extends Component {
    state = {
        timeSheetData: null,
        showModal: false,
        editSkillData: null,
        openForm: false,
        searchquery: '',
        filteredtimeSheetData: [],
    }
    getTimeSheetData = async () => {
        try {
            let response = await fetch(`http://localhost:4000/api/getResourceTimeSheet`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            response = await response.json();
            console.log(response);
            this.setState({ timeSheetData: response.data });
        } catch (error) {
            console.log(error);
        }
    }
    componentDidMount() {
        this.setState({}, () => this.getTimeSheetData());
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
            this.getTimeSheetData();
        } catch (error) {
            console.log(error);
        }
    }
    backNavigation = () => {
        this.setState({openForm: false }, () => this.getTimeSheetData());
    }

    handleEdit = (editSkill) => {
        this.setState({ editSkillData: editSkill, openForm: true });
    }
    
    handleShowTimeSheetTable = () => {
        this.setState({editSkillData:null, openForm: false });
    }
    // handleSearch = (e) => {
    //     let { Skills } = this.state;
    //     let searchquery = e.target.value;
    //     if (!searchquery) {
    //         this.setState({ Skills, searchquery, filteredSkills: [] });
    //         return;
    //     }
    //     let filteredSkills = Skills.filter((skill) => skill.Skill_Name.toLowerCase().startsWith(searchquery.toLowerCase()));
    //     console.log(filteredSkills);
    //     this.setState({ filteredSkills: filteredSkills, searchquery });
    // }
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
        const { timeSheetData } = this.getSearchData();
        console.log(Skills);
        return (
            <React.Fragment>
                {openForm && <Button color="primary m-5" onClick={this.handleShowTimeSheetTable}>Show Time Sheet Data</Button>}
                {!openForm ? <Table dark>
                    <thead>
                        <tr>
                            <th>Project ID</th>
                            <th>Project Name</th>
                            <th>Resource Name</th>
                            <th>Week Number</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeSheetData && timeSheetData.map((sheet, index) => (
                            <tr key={index} >
                                <th scope="row">{sheet.Skill_ID}</th>
                                <td>{sheet.Skill_Name}</td>
                                <td ><AiFillEdit onClick={() => this.handleEdit(sheet)} /></td>
                                
                            </tr>
                        ))}
                    </tbody>
                </Table> : <SkillForm sheet={editSkillData} back={this.backNavigation} />}
            </React.Fragment>
        );
    }
}

export default SkillTable;
