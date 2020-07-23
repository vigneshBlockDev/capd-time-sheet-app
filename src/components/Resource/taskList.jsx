import React from "react"

const TaskList = (props) => {
    return (
        props.taskList.map((val, idx) => {
            console.log("data : " + props.code);
            // const numRows = val.Project_Name.length;
            //console("numRows " +numRows);

            let projectName = `projectName-${idx}`, planned = `planned-${idx}`, actual = `actual-${idx}`
            let projectCode = `projectCode-${idx}`
            return (
                <tr key={val.index}>
                    <td>
                        <input type="text" name="projectCode" value={props.code} data-id={idx} id={projectCode} className="form-control " />
                    </td>
                    <td>
                        <select type="text" name="projectName" id={projectName} data-id={idx} className="form-control "
                            onChange={(e) => props.selectData(e.target.value)}>
                            <option  >Select</option>
                            {
                                props.projectData.map(lists => (
                                    <option value={lists.Project_Code}>{lists.Project_Name}</option>
                                ))
                            }
                        </select>
                    </td>
                    <td>
                        <input name="text" name="planned" id={planned} data-id={idx} className="form-control"></input>
                    </td>
                    <td>
                        <input name="text" name="actual" id={actual} data-id={idx} className="form-control"></input>

                    </td>
                    <td>
                        {
                            idx === 0 ? <button onClick={() => props.add()} type="button" className="btn btn-primary text-center"><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                                : <button className="btn btn-danger" onClick={(() => props.delete(val))} ><i className="fa fa-minus" aria-hidden="true"></i></button>
                        }
                    </td>
                </tr >
            )
        })
    )
}
export default TaskList