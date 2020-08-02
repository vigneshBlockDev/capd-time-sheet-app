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
            <select type="text" data-id={idx} required className="form-control "
              onChange={(event) => props.select(val, 'prj', event)} >
              <option />
              {
                props.projAssigneLists.map((list, idx1) => (
                  <option value={list.Project_Code}  key={list.Project_Code + idx1}>{list.Project_Name}</option>
                ))}
            </select>
          </td>

          <td>
            {val.planned} 
          </td>
            
          <td>
            <input name="text" data-id={idx} className="form-control" value={val.actual} required onInput={(event) => props.select(val, 'A', event)}></input>
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