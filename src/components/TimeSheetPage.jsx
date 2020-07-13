import React, { Component } from 'react';
import httpServices from '../services/httpServices';
import TimeSheetForm from './TimeSheetForm';


class TimeSheetPage extends Component {
    state = {
        week: [],
        projects: [],
        resources: [],
        skill: [],
        availableMonths: [],
        availableYear: []
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
    render() {
        const { projects, resources, skill, week, availableMonths, availableYear } = this.state;
        console.log(this.state);
        return (
            <TimeSheetForm availableMonths={availableMonths} availableYear={availableYear} week={week} projects={projects} resources={resources} skill={skill} />
        );
    }
}

export default TimeSheetPage;