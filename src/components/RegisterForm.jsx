import React  from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from "yup";


const validationSchema = Yup.object().shape({
    userName: Yup.string().required("UserName is Required"),
    password: Yup.string().required("Password is Required"),
    confirmpassword: Yup.string().required('Confirm Password is Required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});
const RegisterForm = () => {
    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
            confirmpassword: '',
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
                <FormGroup>
                    <Label for="confirmpassword">Confirm Password</Label>
                    <Input
                        id="confirmpassword"
                        name="confirmpassword"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.confirmpassword}
                    />
                    {formik.errors.confirmpassword && formik.touched.confirmpassword ? (
                        <div className="badge badge-danger">
                            {formik.errors.confirmpassword}
                        </div>
                    ) : null}
                </FormGroup>
                <Button type='submit'>Submit</Button>
            </Form>
        </div>
    );
}

export default RegisterForm;

