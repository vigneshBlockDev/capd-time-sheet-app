import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from "yup";
const validationSchema = Yup.object().shape({
    userName: Yup.string().required("UserName is Required"),
    password: Yup.string().required("Password is Required"),
});
const LoginForm = () => {
    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async values => {
            console.log(values);
        },
    });
    return (
        <div className="container p-5">
            <Form className="w-50" onSubmit={formik.handleSubmit}>
                <FormGroup>
                    <Label for="userName">Email/UserName</Label>
                    <Input
                        id="userName"
                        name="userName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.userName}

                    />
                    {formik.errors.userName && formik.touched.userName ? (
                        <div className="badge badge-danger">
                            {formik.errors.userName}
                        </div>
                    ) : null}
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password && formik.touched.password ? (
                        <div className="badge badge-danger">
                            {formik.errors.password}
                        </div>
                    ) : null}
                </FormGroup>
            <Button type='submit'>Submit</Button>
            </Form>
        </div>
    );
}

export default LoginForm;

