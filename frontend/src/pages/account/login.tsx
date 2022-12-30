import { Form, Formik } from "formik";
import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { AccountLayout } from "../../components/Layout/AccountLayout";
import { routes } from "../../services/routes/routes";
import { NextPageWithLayout } from "../_app";

/**
 * Login page is a guest route.
 */
const Login: NextPageWithLayout = () => {
    const [isPasswordEyeOpen, setIsPasswordEyeOpen] = useState<boolean>(false)

    // Formik Login Form inital values
    const initialFormValues = {
        email: "",
        password: ""
    }

    /**
     * Handle submit login form
     * @param values from form
     */
    const onFormSubmit = (values: typeof initialFormValues) => {
        console.log(values)
    }

    return <>
        {/* Login Form */}
        <Formik initialValues={initialFormValues} onSubmit={onFormSubmit}>
            <Form className="mb-5 lg:mb-10">
                <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                <TextInput type={isPasswordEyeOpen ? "text" : "password"} name="password" labelText="Password" placeholder="Password" icon={isPasswordEyeOpen ? "visibility" : "visibility_off"} iconOnClick={() => setIsPasswordEyeOpen(!isPasswordEyeOpen)} />
                <Button kind="tertiary" className="mb-5">Forgot Password?</Button>

                <Button to={routes.home} type="submit">Login</Button>
            </Form>
        </Formik>

        {/* Register Text */}
        <div className="flex">
            <p className="mr-2">Don&apos;t have an account?</p>
            <Button to={routes.account.register} kind="tertiary" isColored>Register</Button>
        </div>
    </>
}

Login.getLayout = (page: React.ReactElement) => {
    return <AccountLayout page={page} siteTitle="Login" headline="Welcome back" description="Sign in to your account below." descriptionImage="Login to share your stuff" />
}

export default Login

