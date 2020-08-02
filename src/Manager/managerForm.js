import React from "react";
import "../AutoCompleteText.css";
import "../App.css";
import TaskList from "./taskList"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import moment from 'moment';
import NavBar from "../components/NavBar";

export default class ManagerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskList: [
        {
          index: Math.random(),
          projectCode: "",
          projectName: "",
          planned: "",
          actual: '0',
          isEditMode: false
        }
      ],
      date: "",
      description: "",
      isHidden: false,
      months: [],
      years: [],
      selectedProjectName: "",
      weekList: [],
      projectList: [],
      resourceList: [],
      year: new Date().getFullYear(),
      weekID: '',
      weekEndDate: '',
      resourceName: '',
      resourceID: '',
      reqiredMessage: null,
      totPlannedHrs: '',
      showSuccess: '',
      regexp: /^[0-9\b]+$/
    }

  }


  async componentDidMount() {
    Promise.all([
      fetch(`http://localhost:4000/api/fetchMonthYear`),
      fetch(`http://localhost:4000/api/fetchProjectDetails`),
      fetch(`http://localhost:4000/api/fetchResourceDetails`),
    ])

      .then(([res1, res2, res3]) => {
        return Promise.all([res1.json(), res2.json(), res3.json()]);
      })
      .then(([res1, res2, res3]) => {
        // set state in here
        this.setState({ weekList: res1.data, projectList: res2.data, resourceList: res3.data });

      });
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
    //debugger
    this.setState((prevState) => ({
      taskList: [...prevState.taskList, { index: Math.random(), projectCode: "", projectName: "", planned: "", actual: "0" }],
    }));
  }

  deteteRow = (index) => {
    // debugger
    this.setState({
      taskList: this.state.taskList.filter((s, sindex) => index !== sindex),
    });
    // const taskList1 = [...this.state.taskList];
    // taskList1.splice(index, 1);
    // this.setState({ taskList: taskList1 });
  }
  onHandlePlannedChange = (ePlanHrs) => {

    console.log("plnHrs : " + ePlanHrs)
    if (!this.state.regexp.test(ePlanHrs)) {
      //NotificationManager.warning(<h6 class="text-danger">Planned allows only numbers</h6>);
      return false;
    }
    else if (!ePlanHrs > '45') {
      //NotificationManager.warning(<h6 class="text-danger">Weekly planned Hours not exceed 45</h6>);
      return false;
    }
  }

  onChangeSelect = (data, type, event) => {
    console.log(data, type, event);
    //debugger
    let currState = this.state.taskList.map((item, index) => {
      if (item.index === data.index) {
        if (type === 'prj') {
          item.projectCode = event.target.value
          //debugger
          let prjInfo = this.state.projectList.filter(item => item.Project_Code === event.target.value)
          item.projectName = prjInfo[0] && prjInfo[0].Project_Name
        } else if (type === 'P') {
          item.planned = event.target.value
        } else if (type === 'A') {

          item.actual = event.target.value
        }
      }

      console.log("Item : " + item);
      return item
    })

    console.log("currState : ", currState[0].projectName);
    // debugger
    this.setState((prevState) => ({
      taskList: [...currState]
    }));
    // debugger
    console.log("AFter", this.state.taskList[0].projectName)
  }

  clickOnDelete(record) {
    this.setState({
      taskList: this.state.taskList.filter(r => r !== record)
    });
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })

  };
  changeHandlerWeekId = (e) => {
    let objFields = {}
    objFields.resourceID = this.state.resourceID
    objFields.year = this.state.year
    objFields.weekID = e.target.value
    console.log("objFields : " + objFields)
    const requestFields = {
      method: 'POST',
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ idSelection: objFields })
    };
    // debugger
    const fetchPromise = fetch(`http://localhost:8000/api/fetchPlannedHours`, requestFields);
    fetchPromise.then(response => {
      return response.json();
    }).then(plannedHrs => {
      console.log(plannedHrs);
      debugger
      this.setState({ totPlannedHrs: plannedHrs })
    });

  };
  submitHandler = e => {
    //this.setState.reqiredMessage="this fieldis"
    /*this.setState({ reqiredMessage : "This Field Is" })
    if ( this.state.resourceID != "") {
      return ""
    }*/
    console.log("projectList : " + this.state.projectList);
    e.preventDefault()
    for (var i = 0; i < this.state.taskList.length; i++) {
      if (this.state.taskList[i].projectName === '' || this.state.taskList[i].planned === '') {
        NotificationManager.warning(<h6 class="text-danger">Please Fill up Required Field. Please Check Project name And Planned Field</h6>);
        return false;
      }
    }
    let obj = {}
    obj.weekID = this.state.weekID
    let weekInfo = this.state.resourceList.filter(item => item.week_ID === Number(this.state.weekID))
    obj.weekEndDate = moment(weekInfo[0] && weekInfo[0].To_Date).format('YYYY-MM-DD')
    obj.taskList = this.state.taskList
    obj.resourceID = this.state.resourceID
    let resourceInfo = this.state.resourceList.filter(item => item.Resource_ID === Number(this.state.resourceID))
    console.log("resourceInfo : " + resourceInfo)
    obj.resourceName = resourceInfo[0] && resourceInfo[0].Resource_Name
    obj.year = this.state.year
    console.log(obj)
    debugger
    const plannedHrsTotal = this.state.taskList.reduce((totalHrs, plan) => totalHrs + parseInt(plan.planned, 10), 0);
    const totalHoursPlan = (plannedHrsTotal + this.state.totPlannedHrs);
    console.log("totalHoursPlan : " + totalHoursPlan);

    //_.sumBy(taskList, function(o) { if (o.planned == '45') return o.n; });
    const requestOptions = {
      method: 'POST',
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ managerList: obj })
    };
    // debugger
    fetch('http://localhost:4000/api/resourceTimeSheet', requestOptions)
      .then(response => {
        this.setState({ respStatus: response.json() })
        console.log("respStatus : " + this.state.respStatus)
        // NotificationManager.success("Data Inserted Successfully");
        this.setState({ showSuccess: true })

        setTimeout(() => {
          this.setState({ showSuccess: false })
        }, 2000)

      })

  }


  render() {
    let { taskList } = this.state;
    let { projectList } = this.state;
    const { weekID } = this.state;
    const { resourceID, showSuccess } = this.state;
    let successMessage = showSuccess ? "Success : Data Inserted Successfully" : "";
    return (

      <div className="content">
        < NotificationContainer />
        <NavBar />
        <form onSubmit={this.submitHandler} onChange={this.handleChange} >
          <div class="alert alert-success" role="alert">
            {successMessage}
          </div>
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-sm-1"></div>
            <div className="col-sm-20">
              <div className="card">
                <div className="card-header text-center">Manager Time Sheet</div>
                <div className="card-body">

                  <div className="row">
                    <div className="col-sm-3">
                      <div className="form-group ">
                        <label className='required'><b>Resources</b></label>
                        <select
                          type='text' required
                          name='resourceID' value={resourceID} onChange={this.changeHandler}
                          className='form-control'
                          placeholder='Search Month'>
                          <option />
                          {this.state.resourceList.map((list, idx1) => {
                            //console.log('list', list);
                            return (
                              <option key={list.Resource_ID + '_Op'} value={list.Resource_ID}>
                                {list.Resource_Name}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                    </div>
                    <div className="col-sm-3">
                      <div className="form-group ">
                        <label><b>Year</b></label>
                        <div>{new Date().getFullYear()}</div>
                        {/*<div>{this.state.reqiredMessage ? this.state.reqiredMessage : ""}</div>*/}

                      </div>

                    </div>
                    <div className="col-sm-3">
                      <div className="form-group ">
                        <label className='required'><b>Week</b></label>
                        <select
                          type='text' required
                          name='weekID' value={weekID} onChange={this.changeHandlerWeekId}
                          className='form-control'
                          placeholder='Search Month'>
                          <option />
                          {this.state.weekList.map((list, idx1) => {
                            //console.log('list', list);
                            return (
                              <option key={idx1 + '_Op'} value={list.week_ID}>
                                {moment(list.To_Date).format('MMM Do YYYY')}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <table className="table">
                    <thead class="thead-light">
                      <tr>
                        <th className="" >Project Code</th>
                        <th className="required" >Project Name</th>
                        <th className="required" >Planned</th>

                      </tr>
                    </thead>
                    <tbody>
                      <TaskList
                        add={this.addNewRow}
                        delete={this.clickOnDelete.bind(this)}
                        taskList={taskList}
                        projectLists={projectList}
                        select={this.onChangeSelect}
                        selectPlanned={this.onHandlePlannedChange}

                      />
                    </tbody>
                  </table>
                </div>
                <div className="card-footer text-center"> <button type="submit" className="btn btn-primary text-center">Submit</button></div>
              </div>
            </div>
            <div className="col-sm-1"></div>
          </div>
        </form>
      </div>

    )
  }
}
