import React from "react"

const TaskList = (props) => {

  return (
    props.taskList.map((val, idx) => {
      return (

        <tr key={val.index}>
          <td>
            {val.projectCode}
          </td>

          <td>
           { val.isSavedMode === true ? val.projectName :
            <select type="text" required data-id={idx} className="form-control "
              onChange={(event) => props.select(val, 'prj', event)} value={val.projectCode}>
              <option />
              {
                props.projectLists.map((list, idx1) => (
                  <option value={list.Project_Code} key={list.Project_Code + idx1}>{list.Project_Name}</option>
                ))}
            </select>
          }
          </td>

          <td> 
            <input name="text" data-id={idx} required className="form-control" maxLength = "2" value={val.planned} onInput={(event) => props.select(val, 'P', event)}></input>
          
            </td>
          <td>
            {
              idx === 0 ?
                <button onClick={() => props.add()} type="button" className="btn btn-primary text-center"><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                : <button className="btn btn-danger" onClick={(() => props.delete(val))} ><i className="fa fa-minus" aria-hidden="true"></i></button>
            }
          </td>
        </tr >
      )
    })
  )
}
export default TaskList
