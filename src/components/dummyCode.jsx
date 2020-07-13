import React, { Component } from 'react';
import httpServices from '../services/httpServices';
import TimeSheetForm from './TimeSheetForm';
import { FormGroup, Label, Input, } from 'reactstrap';

class TimeSheetPage extends Component {
    state = {
        week: [],
        projects: [],
        resources: [],
        skill: [],
        year: "",
        month: '',
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
                month.push(data.month);
                year.push(data.year);
            })
            this.setAvailableMonths(month, year);
        })
    }

    setAvailableMonths = (months, years) => {
        months = [...new Set(months)];
        years = [...new Set(years)];
        console.log(months, years);
        this.setState({
            availableMonths: months,
            availableYear: years,
            month: months[0],
            year: years[0]
        })
    }
    getWeeks = () => {
        const { month, year, week } = this.state;
        const filteredWeeks = week.filter(data => {
            if (data.month === month && data.year === year) {
                return data
            }
        })
        this.setState({ week: filteredWeeks });
    }
    setYear = (e) => {
        this.setState({ year: e.target.value }, () => {
            this.getWeeks();
        });
    }

    setMonth = (e) => {
        this.setState({ month: e.target.value });
    }
    render() {
        const { projects, resources, skill, week, availableMonths, availableYear } = this.state;
        console.log(this.state)
        return (
            <React.Fragment>
                <FormGroup>
                    <Label for="month">Month</Label>
                    <Input type="select"
                        name="month"
                        id="month"
                        value={this.state.month}
                        onChange={(e) => this.setMonth(e)}
                        style={{ display: 'block' }}
                    >
                        {availableMonths.length > 0 && availableMonths.map(month => (
                            <option value={month}>{month}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="year">Year</Label>
                    <Input type="select"
                        name="year"
                        id="year"
                        value={this.state.year}
                        onChange={(e) => this.setYear(e)}
                        style={{ display: 'block' }}
                    >
                        {availableYear.length > 0 && availableYear.map(year => (
                            <option value={year}>{year}</option>
                        ))}
                    </Input>
                </FormGroup>
                <TimeSheetForm week={week} projects={projects} resources={resources} skill={skill} />
            </React.Fragment>
        );
    }
}

export default TimeSheetPage;