import React from "react";
import "./AutoCompleteText.css";
import "../../App.css";
import axios from 'axios';
import TaskList from "./taskList"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import moment from 'moment'
import NavBar from "../NavBar";

export default class ResourceForm extends React.Component {

    //add new row and delete row 
    constructor(props) {
        super(props);
        this.state = {
            taskList: [{ index: Math.random(), projectCode: "", projectName: "", planned: "", actual: "" }],
            date: "",
            description: "",
            isHidden: false,
            months: [],
            years: [],
            selectedProjectName: "",
            month: null,
            lists: ["a", "b", "c"],
            data: [],
            selectedProject: '-Choose Project-',
            listData: [],
            projectData: [],
            selectedMonth: "",
            selectedYear: ""
        }

        //this.month = ["Jan", "Feb", "Mar", "June", "July"]
        //this.month = this.state.month.month
        this.year = ["2020", "2021"]
    }


    async componentDidMount() {
        Promise.all([fetch(`http://localhost:4000/api/fetchMonthYear`),
        fetch(`http://localhost:4000/api/fetchTransactionDetails`),
        ])

            .then(([res1, res2]) => {
                return Promise.all([res1.json(), res2.json()])
            })
            .then(([res1, res2]) => {
                // set state in here
                this.setState({
                    data: res1.data,
                    listData: res2.data
                });

            });

    }

    onMonthTextChanged = (e) => {
        const value = e.target.value;
        let months = [];
        if (value.length > 0) {

            const regex = new RegExp(`^${value}`, `i`);
            months = this.state.month.sort.filter((v) => regex.test(v));

        }
        this.setState(() => ({ months, month: value }));
    };
    onYearTextChanged = (e) => {
        const value = e.target.value;
        let years = [];
        if (value.length > 0) {

            const regex = new RegExp(`^${value}`, `i`);
            years = this.year.sort().filter((v) => regex.test(v));
        }
        this.setState(() => ({ years, year: value }));
    };

    monthSelected(value) {
        console.log(value);
        this.setState(() => ({
            month: value,
            months: [],
        }));
    }
    yearSelected(value) {
        this.setState(() => ({
            year: value,
            years: [],
        }));
    }

    renderMonth() {
        const { months } = this.state;
        console.log(months)
        if (months.length === 0) {
            return null;
        }
        return (
            <ul className="AutoCompleteText">
                {months.map((month) => (
                    <li onClick={() => this.monthSelected(month.month)}>{month.month}</li>
                ))}
            </ul>
        );
    }
    renderYear() {
        const { years } = this.state;
        if (years.length === 0) {
            return null;
        }
        return (
            <ul className="AutoCompleteText">
                {years.map((year) => (
                    <li onClick={() => this.yearSelected(year)}>{year}</li>
                ))}
            </ul>
        );
    }



    handleChange = (e) => {
        if (["projectCode", "projectName", "planned", "actual"].includes(e.target.name)) {
            let taskList = [...this.state.taskList]
            taskList[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }
    addNewRow = (e) => {
        this.setState((prevState) => ({
            taskList: [...prevState.taskList, { index: Math.random(), projectCode: "", projectName: "", planned: "", actual: "" }],
        }));
    }

    deteteRow = (index) => {
        this.setState({
            taskList: this.state.taskList.filter((s, sindex) => index !== sindex),
        });
        // const taskList1 = [...this.state.taskList];
        // taskList1.splice(index, 1);
        // this.setState({ taskList: taskList1 });
    }
    onChangeProjectName = (data) => {
        console.log(data);
        this.setState({ selectedProjectName: data.projectName })

        console.log("dag" + this.state.selectedProjectName)
    }



    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.date === '' || this.state.description === '') {
            NotificationManager.warning("Please Fill up Required Field .");
            return false;
        }
        for (var i = 0; i < this.state.taskList.length; i++) {
            if (this.state.taskList[i].projectCode === '' || this.state.taskList[i].task === '') {
                NotificationManager.warning("Please Fill up Required Field.");
                return false;
            }
        }
    }
    clickOnDelete(record) {
        this.setState({
            taskList: this.state.taskList.filter(r => r !== record)
        });
    }

    getUnique(arr, comp) {

        // store the comparison  values in array
        const unique = arr.map(e => e[comp])

            // store the indexes of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the false indexes & return unique objects
            .filter((e) => arr[e]).map(e => arr[e]);

        return unique;
    }

    onChangeProjectName = (data) => {
        console.log("value " + data);
        this.setState({ selectedProjectName: data })

        // console.log("dag" + this.state.selectedProjectName)
    }
    render() {
        const { month } = this.state;
        const { year } = this.state;
        let { taskList } = this.state//let { notes, date, description, taskList } = this.state
        const uniqueYear = this.getUnique(this.state.data, 'year')
        const uniqueMonth = this.getUnique(this.state.data, 'month')
        let { listData } = this.state;
        console.log("monthName: " + this.state.selectedMonth);
        console.log("year: " + this.state.selectedYear)
        return (
            <React.Fragment>
                <NavBar />

                <div className="content">
                    <NotificationContainer />
                    <form onSubmit={this.handleSubmit} onChange={this.handleChangeMonthYear} >
                        <div className="row" style={{ marginTop: 20 }}>
                            <div className="col-sm-1"></div>
                            <div className="col-sm-20">
                                <div className="card">
                                    <div className="card-header text-center">Resource Time Sheet</div>
                                    <div className="card-body">

                                        <div className="row">

                                            <div className="col-sm-2">
                                                <div className="form-group ">
                                                    <label >Year  </label>
                                                    {/*<select  type="text"  className="form-control" placeholder="Search Year"
                                             onChange={(e) => { this.setState({selectedYear : e.target.value})}}>
                                            <option >-Select Year-</option>
                                            {
                                                    uniqueYear.map(list => (
                                                    
                                                        <option>{list.year}</option>
                                                    ))
                                            }
                                        </select>*/}
                                                    <div disabled >{new Date().getFullYear()}</div>


                                                </div>
                                            </div>

                                            <div className="col-sm-2">
                                                <div className="form-group ">
                                                    <label className="required">Month</label>
                                                    <select type="text" className="form-control" placeholder="Search Month">
                                                        <option isdisabled>-Select Month-</option>

                                                        {
                                                            uniqueMonth.map(list => (

                                                                <option>{list.month.toUpperCase()}</option>
                                                            ))
                                                        }
                                                    </select>

                                                </div>
                                            </div>

                                            <div className="col-sm-2">
                                                <div className="form-group ">
                                                    <label className="required">Week</label>
                                                    <select type="text" className="form-control" placeholder="Search Month">
                                                        <option isdisabled>-Select Week-</option>
                                                        {
                                                            this.state.data.map(list => {
                                                                console.log('list', list);
                                                                return (
                                                                    <option>

                                                                        {moment(list.To_Date).format("MMM Do YYYY")}


                                                                    </option>
                                                                );
                                                            })
                                                        }
                                                    </select>

                                                </div>
                                            </div>
                                        </div>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="required" >Project Code</th>
                                                    <th className="required" >Project Name</th>
                                                    <th>Planned</th>
                                                    <th>Actual</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <TaskList add={this.addNewRow} delete={this.clickOnDelete.bind(this)} taskList={taskList} projectData={listData} selectData={this.onChangeProjectName} code={this.state.selectedProjectName} />
                                            </tbody>
                                            {/* <tfoot>
                                        <tr><td colSpan="4">
                                            <button onClick={this.addNewRow} type="button" className="btn btn-primary text-center"><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                                        </td></tr>
                                   </tfoot>*/}
                                        </table>
                                    </div>
                                    <div className="card-footer text-center"> <button type="submit" className="btn btn-primary text-center">Submit</button></div>
                                </div>
                            </div>
                            <div className="col-sm-1"></div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}
