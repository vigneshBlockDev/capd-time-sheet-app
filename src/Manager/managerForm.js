import React from "react";
import "../AutoCompleteText.css";
import "../App.css";
import TaskList from "./taskList"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import moment from 'moment';
import NavBar from "../components/NavBar";
import { Button } from "reactstrap";

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
      regexp: /^\s*\d*\s*$/,
      projAssigneList: [],
      configData: [],
      configResponse: [],
      respStatus: []
    }

  }

  //This Method call once all our children elements 
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
        this.setState({ weekList: res1.data, projectList: res2.data, resourceList: res3.data });

      });
  }// end componentDidMount()

  handleChange = (e) => {
    if (["projectCode", "projectName", "planned"].includes(e.target.name)) {
      let taskList = [...this.state.taskList]
      taskList[e.target.dataset.id][e.target.name] = e.target.value;
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }//end handleChange

  addNewRow = (e) => {
    this.setState((prevState) => ({
      taskList: [...prevState.taskList, { index: Math.random(), projectCode: "", projectName: "", planned: ""}],
    }));
  }

  // deteteRow = (index) => {
  //   this.setState({
  //     taskList: this.state.taskList.filter((s, sindex) => index !== sindex),
  //   });
  // }

  clickOnDelete(record) {
    this.setState({
      taskList: this.state.taskList.filter(r => r !== record)
    });
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })

  };

  onChangePlannedHrs = (ePlanHrs) => {
    console.log("plnHrs : " + ePlanHrs)
    if (!this.state.regexp.test(ePlanHrs)) {
      alert(" Planned Field allows only numberic value");
      return true;
    }
  }

//This function will works based on data entered in row
  onChangeSelect = (data, type, event) => {
    let isPlannedFieldInValid = (type === 'prj'? "" :this.onChangePlannedHrs(event.target.value));
    if(isPlannedFieldInValid && type === 'P'){
      return false
    }
    console.log(data, type, event);
    let currState = this.state.taskList.map((item, index) => {
      if (item.index === data.index) {
        if (type === 'prj') {
          item.projectCode = event.target.value
          let prjInfo = this.state.projectList.filter(item => item.Project_Code === event.target.value)
          item.projectName = prjInfo[0] && prjInfo[0].Project_Name
        } else if (type === 'P') {
          item.planned = event.target.value
        }
      }
      console.log("Item : " + item);
      return item
    })
    this.setState((prevState) => ({
      taskList: [...currState]
    }));
    // debugger
    console.log("AFter", this.state.taskList[0].projectName)
  }

 //This function works based on resourceID and weekID selection
  onChangeSelectWeekId = (e) => {
    let objFields = {}
    objFields.resourceID = this.state.resourceID
    objFields.year = this.state.year
    objFields.weekID = e.target.value
    debugger
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
     //console.log("configName : " + localStorage.getItem('configInfo'))
     const fetchPromise = fetch(`http://localhost:4000/api/fetchAssignedProject`, requestFields);
     fetchPromise.then(response => {
       return response.json();
     }).then(projAssigneList => {
      console.log(projAssigneList);
      this.setState({ projAssigneList: projAssigneList.data})
      let tempTaskList = []
      if(projAssigneList.data.length !== 0) {
        projAssigneList.data.map(prjInfo => {
          tempTaskList.push({
            index: Math.random(),
            planned: prjInfo.Planned_Hours,
            projectCode: prjInfo.Project_Code,
            projectName : prjInfo.Project_Name,
            isSavedMode : true
          })
        })
      } else{
          tempTaskList.push({ 
          isSavedMode : false
      })
    }//else
        this.setState({
        taskList: tempTaskList
        })
      })
    const fetchPromises = fetch(`http://localhost:4000/api/fetchConfigDetails`);
    fetchPromises.then(response => {
    return response.json();
    }).then(configResponse => {
        console.log("configResponse : " +configResponse)
        this.setState({configResponse : configResponse});
    })
};//onChangeSelectWeekId

//This function to get the previous week details
onClickPreviousWeek = e => {
  debugger
  let loadObject = {}
  loadObject.resourceID = this.state.resourceID
  loadObject.weekID = (this.state.weekID - 1)
  loadObject.year = this.state.year
  console.log(loadObject);
  const reqLoadPreviousWeek = {
    method: 'POST',
    // mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({idSelection: loadObject })
  };
  const fetchPromise = fetch('http://localhost:4000/api/fetchAssignedProject', reqLoadPreviousWeek);
  fetchPromise.then(response => {
  return response.json();
  }).then(loadResponse => {
      console.log("loadResponse : " +loadResponse)
      this.setState({projAssigneList : loadResponse.data});
      let tempTaskList = []
      this.state.projAssigneList.map(prjInfo => {
      tempTaskList.push({
        index: Math.random(),
        planned: prjInfo.Planned_Hours,
        projectCode: prjInfo.Project_Code,
        projectName : prjInfo.Project_Name,
        isSavedMode : true,
        isLoadMode : true
      })
      this.setState({
        taskList: tempTaskList,
        weekID: loadObject.weekID
      })
    })
  })
}//onClickPreviousWeek

  //sumbit the request data to service layer
  onsubmitHandler = e => {
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
    debugger
    let weekInfo = this.state.weekList.filter(item => item.week_ID === Number(this.state.weekID))
    obj.weekEndDate = moment(weekInfo[0] && weekInfo[0].To_Date).format('YYYY-MM-DD')
    obj.taskList = this.state.taskList
    obj.resourceID = this.state.resourceID
    let resourceInfo = this.state.resourceList.filter(item => item.Resource_ID === Number(this.state.resourceID))
    console.log("resourceInfo : " + resourceInfo)
    obj.resourceName = resourceInfo[0] && resourceInfo[0].Resource_Name
    obj.year = this.state.year
    console.log(obj)
    //let configData = localStorage.getItem('configInfo');
    let shoreType = resourceInfo[0] && resourceInfo[0].Shore
    let configInfo = this.state.configResponse.data.filter(item => item.config_key === shoreType)
    let configValue = configInfo[0] && configInfo[0].config_value
    console.log("configValue: "+configValue)
    const plannedHrsTotal = this.state.taskList.reduce((totalHrs, plan) => totalHrs + parseInt(plan.planned, 10), 0);
    const assignPlanHrs = this.state.projAssigneList.reduce((totalHrs, plan) => totalHrs + parseInt(plan.Planned_Hours, 10), 0);
    const totalHoursPlan = plannedHrsTotal + assignPlanHrs;
    console.log("totalHoursPlan : " + totalHoursPlan);
    if(plannedHrsTotal > configValue)
    { 
      alert( shoreType +" Planned hours for a week should not exceed "+configValue+ "hrs. Left out hours for the week is: " + (configValue - assignPlanHrs), "attempt :"+plannedHrsTotal);
      return false;
    }
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
     const fetchData = fetch('http://localhost:4000/api/resourceTimeSheet', requestOptions)
      fetchData.then(response => {
        return response.json();
      }).then(respStatus =>{
        console.log("respStatus : " + respStatus.json)
      this.setState({ respStatus: respStatus.message});
      this.setState({ showSuccess: true,  taskList : [] ,resourceID: "", weekID: ""})
      setTimeout(() => {
        this.setState({ showSuccess: false })
      }, 2000)
      })
  }
  
  render() {
    const { resourceID, showSuccess, weekID, projAssigneList, projectList, taskList } = this.state;
    let successMessage = showSuccess ?  this.state.respStatus : "";
    let isEnabled = !(projAssigneList.length === 0 && weekID && resourceID) 
    return (

      <div className="content">
        < NotificationContainer />
        <NavBar />
        <form onSubmit={this.onsubmitHandler} onChange={this.handleChange} >
          <div  class="alert alert-success" role="alert">
           {successMessage}
          </div>
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-sm-1"></div>
            <div className="col-sm-20">
              <div className="card">
                <div className="card-header text-center"><b>Manager Time Sheet</b></div>
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
                            <option/>
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
                  
                    <div className="col-sm-3">
                      <div className="form-group ">
                          <div></div>
                        <Button disabled={isEnabled }
                         onClick={this.onClickPreviousWeek} class = { isEnabled ? "disableColor" : "enableColor"} >Previous Week</Button>
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
                       // selectPlanned={this.onHandlePlannedChange}
                        projAssigneLists={projAssigneList}

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
