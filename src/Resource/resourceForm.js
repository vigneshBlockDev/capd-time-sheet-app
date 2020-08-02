import React from "react";
import "../AutoCompleteText.css";
import "../App.css";
import TaskList from "./taskList"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import moment from 'moment';
import NavBar from "../components/NavBar";

export default class ResourceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskList: [
        {
          index: Math.random(),
          projectCode: "",
          projectName: "",
          planned: "",
          actual: "",
          isEditMode: false
        }
      ],
      date: "",
      description: "",
      isHidden: false,
      months: [],
      years: [],
      weekList: [],
      resourceList: [],
      year: new Date().getFullYear(),
      weekID: '',
      weekEndDate: '',
      resourceName: '',
      resourceID: '',
      reqiredMessage: null,
      projAssigneList: [],
      showSuccess: '',
    }

  }

  async componentDidMount() {
    Promise.all([
      fetch(`http://localhost:4000/api/fetchMonthYear`),
      fetch(`http://localhost:4000/api/fetchResourceDetails`),
    ])

      .then(([res1, res2]) => {
        return Promise.all([res1.json(), res2.json()]);
      })
      .then(([res1, res2]) => {
        // set state in here
        this.setState({ weekList: res1.data, resourceList: res2.data });

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
      taskList: [...prevState.taskList, { index: Math.random(), projectCode: "", projectName: "", planned: "", actual: "" }],
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

  onChangeSelect = (data, type, event) => {
    console.log(data, type, event);
    //debugger
    let currState = this.state.taskList.map((item, index) => {
      if (item.index === data.index) {
        if (type === 'prj') {
          item.projectCode = event.target.value
          let assignHrs = this.state.projAssigneList.filter(item => item.Project_Code === event.target.value)
          item.planned = assignHrs[0] && assignHrs[0].Planned_Hours
          let prjInfo = this.state.projAssigneList.filter(item => item.Project_Code === event.target.value)
          item.projectName = prjInfo[0] && prjInfo[0].Project_Name
        } else if (type === 'A') {
          item.actual = event.target.value
        }
      }
      console.log("Item : " + item);
      return item
    })

    // console.log("currState : ", currState[0].projectName);
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
    const fetchPromise = fetch(`http://localhost:4000/api/fetchAssignedProject`, requestFields);
    fetchPromise.then(response => {
      return response.json();
    }).then(projAssigneList => {
      console.log(projAssigneList);
      this.setState({ projAssigneList: projAssigneList.data })
    });
  }

  submitHandler = e => {
    //this.setState.reqiredMessage="this fieldis"
    /*this.setState({ reqiredMessage : "This Field Is" })
    if ( this.state.resourceID != "") {
      return ""
    }*/
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

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ managerList: obj })
    };
    const fetchPromise = fetch(`http://localhost:4000/api/resourceTimeSheet`, requestOptions)
    // .then(response => response.json())
    fetchPromise.then(response => {
      return response.json();
    }).then(returnObj => {
      console.log(returnObj);
      this.setState({ showSuccess: true })

      setTimeout(() => {
        this.setState({ showSuccess: false })
      }, 2000)
    });
  }

  render() {
    let { taskList } = this.state;
    let { projAssigneList } = this.state;
    const { weekID } = this.state;
    const { resourceID, showSuccess } = this.state;
    let successMessage = showSuccess ? "Success : Data Inserted Successfully" : "";
    return (

      <div className="content">
        <NotificationContainer />
        <NavBar />
        <form onSubmit={this.submitHandler} onChange={this.handleChange} >
          <div class="alert alert-success" role="alert">
            {successMessage}
          </div>
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-sm-1"></div>
            <div className="col-sm-20">
              <div className="card">
                <div className="card-header text-center">Resource Time Sheet</div>
                <div className="card-body">

                  <div className="row">
                    <div className="col-sm-3">
                      <div className="form-group ">
                        <label className='required'><b>Resources</b></label>
                        <select
                          type='text' required
                          name='resourceID' value={resourceID} onChange={this.onChangeHandler}
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
                        <th className="" >Planned</th>
                        <th className="required">Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      <TaskList
                        add={this.addNewRow}
                        delete={this.clickOnDelete.bind(this)}
                        taskList={taskList}
                        projAssigneLists={projAssigneList}
                        select={this.onChangeSelect}

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
