import React, { Component } from 'react';
import { Table, FormGroup, Label, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import {  AiFillEdit } from 'react-icons/ai';
import httpServices from '../services/httpServices';
import TimeSheetForm from './TimeSheetForm';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar';

class   TimeSheetTable extends Component {
    state = {
        filteredtimeSheetData: [],
        availableMonths: [],
        availableYear: [],
        week: [],
        projects: [],
        resources: [],
        resourceName: '',
        selectedMonth: '',
        selectedYear: '',
        timeSheetData: [],
        editTimeSheetData : {},
        openForm :false,
    }
    getTimeSheetData = async () => {
        const { resourceName, selectedMonth, selectedYear } = this.state;
        if (resourceName && selectedMonth && selectedYear) {
            let response = await httpServices.get(`http://localhost:4000/api/getTimeSheetRecord`);
            console.log(response);
            if (response.data.status !== 200) {
                alert('No Record Found');
            } else {
                this.setState({ timeSheetData: response.data.data });
            }
        }
    }
    async componentDidMount() {
        let month = [];
        let year = [];
        let timesheet = await httpServices.get('http://localhost:4000/api/getAllData');
        timesheet = timesheet.data;
        this.setState({
            week: timesheet.week,
            projects: timesheet.projects,
            resources: timesheet.resources,
            skill: timesheet.skill,
        }, () => {
            this.state.week.map(data => {
                month.push(data.Month);
                year.push(data.Year);
            })
            this.setAvailableMonths(month, year);
        })
    }

    setAvailableMonths = (months, years) => {
        months = [...new Set(months)];
        years = [...new Set(years)];
        this.setState({
            availableMonths: months,
            availableYear: years,
        })
    }
    
    backNavigation = () => {
        this.setState({ openForm: false }, () => this.getTimeSheetData());
    }

    handleEdit = (data) => {
        this.setState({ editTimeSheetData: data, openForm: true });
    }

    handleShowTimeSheetTable = () => {
        this.setState({ editSkillData: null, openForm: false });
    }

    handleResourceName = (e) => {
        this.setState({ resourceName: e.target.value },() => {
            this.getTimeSheetData();
        });
    }
    handleMonth = (e) => {
        this.setState({ selectedMonth: e.target.value },() => {
            this.getTimeSheetData();
        });
    }

    handleYear = (e) => {
        this.setState({ selectedYear: e.target.value },() => {
            this.getTimeSheetData();
        });
    }
    openForm = () => {
        const { history } = this.props;
        history.push('/TimeSheetForm');
    }
    render() {
        const { projects, openForm, resources, skill, week, availableMonths, availableYear,selectedMonth,selectedYear,resourceName,timeSheetData,editTimeSheetData } = this.state;
        return (
            <React.Fragment>
                 <NavBar />
                {!openForm ? <React.Fragment>
                    <div className="row">
                        <div className="p-5">
                            <FormGroup>
                                <Label for="Resource_Name">Resource Name</Label>
                                <Input type="select"
                                    name="Resource_Name"
                                    id="Resource_Name"
                                    value={resourceName}
                                    onChange={this.handleResourceName}
                                >
                                    <option selected="true" disabled="disabled" value="">Choose Resource</option>
                                    {resources.length > 0 && resources.map(resource => (
                                        <option key={resource.Resource_Name} value={resource.Resource_Name}>{resource.Resource_Name}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="p-5">
                            <FormGroup>
                                <Label for="month">Month</Label>
                                <Input type="select"
                                    name="month"
                                    id="month"
                                    value={selectedMonth}
                                    onChange={this.handleMonth}
                                >
                                    <option selected="true" disabled="disabled" value="">Choose Month</option>
                                    {availableMonths.length > 0 && availableMonths.map(data => (
                                        <option key={data} value={data}>{data}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="p-5">
                            <FormGroup>
                                <Label for="year">Year</Label>
                                <Input type="select"
                                    name="year"
                                    id="year"
                                    value={selectedYear}
                                    onChange={this.handleYear}
                                >
                                    <option selected="true" disabled="disabled" value="">Choose Year</option>
                                    {availableYear.length > 0 && availableYear.map(data => (
                                        <option key={data} value={data}>{data}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
                    <Table dark>
                        <thead>
                            <tr>
                                <th>Project Code</th>
                                <th>Project Name</th>
                                <th>Planned Hours</th>
                                <th>Actual Hours</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeSheetData.length > 0 && timeSheetData.map((data, index) => (
                                <tr key={data.Transaction_ID}>
                                    <td>{data.Project_Code}</td>
                                    <td>{data.Project_Name}</td>
                                    <td>{data.Planned_Hours}</td>
                                    <td>{data.Actual_Hours}</td>
                                    <td ><AiFillEdit onClick={() => this.handleEdit(data)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </React.Fragment> :  <TimeSheetForm availableMonths={availableMonths} availableYear={availableYear} week={week} projects={projects} resources={resources} skill={skill} back={this.backNavigation} timeSheetData={editTimeSheetData} />}
                {localStorage.getItem('isAdmin') === 'true' && <div className="container text-centre">
                    <Button type='button' onClick={this.openForm} >Add Details</Button>
                </div>}

            </React.Fragment>
        );
    }
}

export default  withRouter(TimeSheetTable);
