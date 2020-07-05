import React from 'react';
import { useFormik } from 'formik';
import { Button, Form, FormGroup, Label, Input, } from 'reactstrap';

const ProjectForm = ({ project, back }) => {
    const formik = useFormik({
        initialValues: {
            Project_ID: project ? project.Project_ID : "",
            Project_Code: project ? project.Project_Code : "",
            Project_Name: project ? project.Project_Name : "",
        },
        enableReinitialize: true,
        onSubmit: async values => {
            if (!project) {
                try {
                    let response = await fetch(`http://localhost:4000/api/addProjects`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ project: values }),
                    });
                    response = await response.json();
                    console.log(response);
                    back();
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    let response = await fetch(`http://localhost:4000/api/updateproject`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ project: values }),
                    });
                    response = await response.json();
                    console.log(response);
                    back();
                } catch (error) {
                    console.log(error);
                }
            }
        },
    });
    return (
        <React.Fragment>
            <div className="container p-5">
                <Form className="w-50" onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <Label for="Project_ID">Project ID</Label>
                        <Input
                            id="Project_ID"
                            name="Project_ID"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.Project_ID}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Project_Code">Project Code</Label>
                        <Input
                            id="Project_Code"
                            name="Project_Code"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.Project_Code}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Project_Name">Project Name</Label>
                        <Input
                            id="Project_Name"
                            name="Project_Name"
                            type="Project_Name"
                            onChange={formik.handleChange}
                            value={formik.values.Project_Name}
                        />
                    </FormGroup>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </React.Fragment>
    );
};

export default ProjectForm;