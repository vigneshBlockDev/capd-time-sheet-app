import React from "react";
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
        }
      ],
      weekList: [],
      resourceList: [],
      projectList: [],
      year: new Date().getFullYear(),
      weekID: '',
      weekEndDate: '',
      resourceName: '',
      resourceID: '',
      projAssigneList: [],
      showSuccess: '',
      regexp: /^\s*\d*\s*$/,
      respStatus: []
    }

  }

  async componentDidMount() {
    Promise.all([
      fetch(`http://localhost:4000/api/fetchMonthYear`),
      fetch(`http://localhost:4000/api/fetchResourceDetails`),
      fetch(`http://localhost:4000/api/fetchProjectDetails`),
    ])

      .then(([res1, res2, res3]) => {
        return Promise.all([res1.json(), res2.json(), res3.json()]);
      })
      .then(([res1, res2, res3]) => {
        // set state in here
        this.setState({ weekList: res1.data, resourceList: res2.data, projectList: res3.data, });

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
  
  clickOnDelete(record) {
    this.setState({
      taskList: this.state.taskList.filter(r => r !== record)
    });
  }

 changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })

  };

  onChangeActualHrs = (ePlanHrs) => {
    console.log("plnHrs : " +ePlanHrs)
     if(!this.state.regexp.test(ePlanHrs)){
      alert(" Planned Field Its allows only numbers");
      return true;
     }
    }

  onChangeSelect = (data, type, event) => {
    console.log(data, type, event);
    let isActualFieldInValid =  (type === 'prj'? "" :this.onChangeActualHrs(event.target.value))
    if(isActualFieldInValid && type === 'A'){
        return false
    }
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
    // debugger
    this.setState((prevState) => ({
      taskList: [...currState]
    }));
    // debugger
    console.log("AFter", this.state.taskList[0].projectName)

  }

  onChangeSelectWeekId = (e) => {
    debugger
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
     debugger
    const fetchPromise = fetch(`http://localhost:4000/api/fetchAssignedProject`, requestFields);
    fetchPromise.then(response => {
      return response.json();
    }).then(projAssigneList => {
      console.log(projAssigneList);
      this.setState({ projAssigneList: projAssigneList.data })
      if(projAssigneList.data.length === 0)
    {
      alert("No Projects are assigned for this week")
    }
    let tempTaskList = []
      if(projAssigneList.data.length !== 0) {
     projAssigneList.data.map(prjInfo => {
      tempTaskList.push({
        index: Math.random(),
        actual: prjInfo.Actual_Hours,
        planned: prjInfo.Planned_Hours,
        projectCode: prjInfo.Project_Code,
        projectName : prjInfo.Project_Name,
        isSavedMode : true
      })
    })} else{
      tempTaskList.push({ 
        isSavedMode : false
      })
    }

    this.setState({
      taskList: tempTaskList
    })
    });
    const fetchPromises = fetch(`http://localhost:4000/api/fetchConfigDetails`);
    fetchPromises.then(response => {
    return response.json();
    }).then(configResponse => {
        console.log("configResponse : " +configResponse)
        this.setState({configResponse : configResponse});
    })
  }

  onsubmitHandler = e => {
    e.preventDefault()
    let obj = {}
    obj.weekID = this.state.weekID
    let weekInfo = this.state.weekList.filter(item => item.week_ID === Number(this.state.weekID))
    obj.weekEndDate = moment(weekInfo[0] && weekInfo[0].To_Date).format('YYYY-MM-DD')
    obj.taskList = this.state.taskList
    obj.resourceID = this.state.resourceID
    let resourceInfo = this.state.resourceList.filter(item => item.Resource_ID === Number(this.state.resourceID))
    console.log("resourceInfo : " + resourceInfo)
    obj.resourceName = resourceInfo[0] && resourceInfo[0].Resource_Name
    obj.year = this.state.year
    console.log(obj);
    let shoreType = resourceInfo[0] && resourceInfo[0].Shore
    let configInfo = this.state.configResponse.data.filter(item => item.config_key === shoreType)
    let configValue = configInfo[0] && configInfo[0].config_value
    console.log("configValue: "+configValue)
    debugger
    const plannedHrsTotal = this.state.taskList.reduce((totalHrs, plan) => totalHrs + parseInt(plan.actual, 10), 0);
    const assignPlanHrs = this.state.projAssigneList.reduce((totalHrs, plan) => totalHrs + parseInt(plan.Actual_Hours, 10), 0);
    const totalHoursPlan =  plannedHrsTotal + assignPlanHrs;
   console.log("totalHoursPlan : " + totalHoursPlan);
   if(plannedHrsTotal > configValue)
    { 
      alert( shoreType +" Planned hours for a week should not exceed "+configValue+ "hrs.");
      return false;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ managerList: obj })
    };
    const fetchData = fetch('http://localhost:4000/api/resourceTimeSheet', requestOptions)
    fetchData.then(response => {
      return response.json();
    }).then(respStatus =>{
    console.log("respStatus : " + respStatus.json)
    this.setState({ respStatus: respStatus.message});
      this.setState({ showSuccess: true , taskList : [], resourceID: "", weekID: ""})
      setTimeout(() => {
        this.setState({ showSuccess: false })
      }, 2000)
    });
  }

  render() {
    const { resourceID, showSuccess, weekID, projectList, taskList } = this.state;
    let successMessage = showSuccess ? this.state.respStatus : "";
    return (

      <div className="content">
        <NotificationContainer />
        <NavBar />
        <form onSubmit={this.onsubmitHandler} onChange={this.handleChange} >
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
                      </div>

                    </div>
                    <div className="col-sm-3">
                      <div className="form-group ">
                        <label className='required'><b>Week</b></label>
                        <select
                          type='text' required
                          name='weekID' value={weekID} onChange={this.onChangeSelectWeekId}
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
                        projectLists={projectList}
                        select={this.onChangeSelect}
                        //selectPlanned = {this.onHandlePlannedChange}

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
