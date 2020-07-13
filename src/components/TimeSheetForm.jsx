import React from 'react';
import { useFormik } from 'formik';
import { Button, Form, FormGroup, Label, Input, } from 'reactstrap';
import Axios from 'axios';

const TimeSheetForm = ({ week, projects, resources, skills,availableYear,availableMonths }) => {
    const formik = useFormik({
        initialValues: {
            Project_Code: "",
            Project_Name: "",
            Resource_Name: "",
            To_Date: "",
            year: "",
            month: "",
            actualHours: '',
            plannedHours: "",
        },
        enableReinitialize: true,
        onSubmit: async values => {
            projects.map(project => {
                if(project.Project_Name === values.Project_Name ){
                    values['Project_Code'] = project.Project_Code;
                }
            })
            resources.map(resource => {
                if(resource.Resource_Name === values.Resource_Name ){
                    values['Resource_ID'] = resource.Resource_ID;
                }
            })
            values['year'] = new Date(values.To_Date).getFullYear();
            values['To_Date'] =`${new Date(values['To_Date']).getFullYear()}-${new Date(values['To_Date']).getMonth()+1}-${new Date(values['To_Date']).getDay()+1}`;
            const response = await Axios.post('http://localhost:4000/api/assignTaskToResoruce',{values});
            
            
        },
    });
    return (
        <React.Fragment>
            <div className="container p-5">
                <Form className="w-50" onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <Label for="Resource_ID">Project Name</Label>
                        <Input type="select"
                            name="Project_Name"
                            id="Project_Name"
                            value={formik.values.Project_Name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ display: 'block' }}
                        >
                            <option selected="true" disabled="disabled" value="">Choose Projects</option> 
                            {projects.length > 0 && projects.map(project => (
                                <option value={project.Project_Name}>{project.Project_Name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Resource_Name">Resource Name</Label>
                        <Input type="select"
                            name="Resource_Name"
                            id="Resource_Name"
                            value={formik.values.Resource_Name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ display: 'block' }}
                        >
                             <option selected="true" disabled="disabled" value="">Choose Resource</option> 
                            {resources.length > 0 && resources.map(resource => (
                                <option value={resource.Resource_Name}>{resource.Resource_Name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="month">Month</Label>
                        <Input type="select"
                            name="month"
                            id="month"
                            value={formik.values.month}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ display: 'block' }}
                        >
                            <option selected="true" disabled="disabled" value="">Choose Month</option> 
                            {availableMonths.length > 0 && availableMonths.map(data => (
                                <option value={data}>{data}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="year">Year</Label>
                        <Input type="select"
                            name="year"
                            id="year"
                            value={formik.values.year}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ display: 'block' }}
                        >
                            <option selected="true" disabled="disabled" value="">Choose Year</option> 
                            {availableYear.length > 0 && availableYear.map(data => (
                                <option value={data}>{data}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="To_Date">End Date/Week</Label>
                        <Input type="select"
                            name="To_Date"
                            id="To_Date"
                            value={formik.values.To_Date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ display: 'block' }}
                        >
                           <option selected="true" disabled="disabled" value="">Choose End Date</option> 
                            {week.length > 0 && week.map(data => (
                                <option value={data.To_Date}>{new Date(data.To_Date).toGMTString()}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="actualHours">Actual Hours</Label>
                        <Input
                            id="actualHours"
                            name="actualHours"
                            type="actualHours"
                            onChange={formik.handleChange}
                            value={formik.values.actualHours}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="plannedHours">Planned Hours</Label>
                        <Input
                            id="plannedHours"
                            name="plannedHours"
                            type="plannedHours"
                            onChange={formik.handleChange}
                            value={formik.values.plannedHours}
                        />
                    </FormGroup>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </React.Fragment>
    );
};

export default TimeSheetForm;