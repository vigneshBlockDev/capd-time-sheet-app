import React from 'react';
import { useFormik } from 'formik';
import { Button, Form, FormGroup, Label, Input, } from 'reactstrap';

const SkillForm = ({ skill, back }) => {
    const formik = useFormik({
        initialValues: {
            Skill_ID: skill ? skill.Skill_ID : "",
            Skill_Name: skill ? skill.Skill_Name : "",
        },
        onSubmit: async values => {
            if (!skill) {
                try {
                    let response = await fetch(`http://localhost:4000/api/addskill`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ skill: values }),
                    });
                    response = await response.json();
                    console.log(response);
                    back();
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    let response = await fetch(`http://localhost:4000/api/updateskill`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ skill: values }),
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
                        <Label for="Skill_ID">Skill ID</Label>
                        <Input
                            id="Skill_ID"
                            name="Skill_ID"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.Skill_ID}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Skill_Name">Skill Name</Label>
                        <Input
                            id="Skill_Name"
                            name="Skill_Name"
                            type="Skill_Name"
                            onChange={formik.handleChange}
                            value={formik.values.Skill_Name}
                        />
                    </FormGroup>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </React.Fragment>
    );
};

export default SkillForm;