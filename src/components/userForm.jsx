import React from 'react';
import { useFormik } from 'formik';
import { Button, Form, FormGroup, Label, Input, } from 'reactstrap';

const UserForm = ({ user, back }) => {
    const formik = useFormik({
        initialValues: {
            Resource_ID: user ? user.Resource_ID : "",
            Resource_Name: user ? user.Resource_Name : "",
            SOW_Category: user ? user.SOW_Category : "",
            Billing_Type: user ? user.Billing_Type : "",
            City: user ? user.City : "",
            Shore: user ? user.Shore : "",
            Skill_Set: user ? user.Skill_Set : ""
        },
        enableReinitialize: true,
        onSubmit: async values => {
            if (!user) {
                try {
                    let response = await fetch(`http://localhost:4000/api/addResources`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user: values }),
                    });
                    response = await response.json();
                    console.log(response);
                    back();
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    let response = await fetch(`http://localhost:4000/api/updateresources`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user: values }),
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
                        <Label for="Resource_ID">Resource ID</Label>
                        <Input
                            id="Resource_ID"
                            name="Resource_ID"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.Resource_ID}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Resource_Name">Resource Name</Label>
                        <Input
                            id="Resource_Name"
                            name="Resource_Name"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.Resource_Name}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="SOW_Category">SOW Category</Label>
                        <Input
                            id="SOW_Category"
                            name="SOW_Category"
                            type="SOW_Category"
                            onChange={formik.handleChange}
                            value={formik.values.SOW_Category}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Billing_Type">Billing Type</Label>
                        <Input
                            id="Billing_Type"
                            name="Billing_Type"
                            type="Billing_Type"
                            onChange={formik.handleChange}
                            value={formik.values.Billing_Type}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="City">City</Label>
                        <Input
                            id="City"
                            name="City"
                            type="City"
                            onChange={formik.handleChange}
                            value={formik.values.City}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Shore">Shore</Label>
                        <Input
                            id="Shore"
                            name="Shore"
                            type="Shore"
                            onChange={formik.handleChange}
                            value={formik.values.Shore}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Skill_Set">Skill Set</Label>
                        <Input
                            id="Skill_Set"
                            name="Skill_Set"
                            type="Skill_Set"
                            onChange={formik.handleChange}
                            value={formik.values.Skill_Set}
                        />
                    </FormGroup>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </React.Fragment>
    );
};

export default UserForm;