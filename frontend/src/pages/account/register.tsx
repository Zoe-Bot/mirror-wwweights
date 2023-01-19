import { Form, Formik } from "formik"
import { signIn, SignInResponse } from "next-auth/react"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import * as yup from 'yup'
import { Button } from "../../components/Button/Button"
import { TextInput } from "../../components/Form/TextInput/TextInput"
import { AccountLayout } from "../../components/Layout/AccountLayout"
import { routes } from "../../services/routes/routes"
import { NextPageCustomProps } from "../_app"

type RegisterDto = {
    email: string
    username: string
    password: string
}

/**
 * Register page is a guest route.
 */
const Register: NextPageCustomProps = () => {
    const router = useRouter()
    // Redirect to page where you clicked login
    const callbackUrl = useMemo(() => typeof router.query.callbackUrl == "string" ? router.query.callbackUrl : router.query.callbackUrl?.[0] ?? null, [router])

    // Local State
    const [error, setError] = useState("")

    // Formik Form Initial Values
    const initialFormValues: RegisterDto = {
        email: "",
        username: "",
        password: ""
    }

    // Formik Form Validation
    const validationSchema: yup.SchemaOf<RegisterDto> = yup.object().shape({
        email: yup.string().email("Must be a valid E-Mail.").required("E-Mail is required."),
        username: yup.string().min(3).max(20).required("E-Mail is required."),
        password: yup.string().min(8).max(128).required("Password is required.")
    })

    /**
     * Handle submit register form.
     * @param values input from form
     */
    const onFormSubmit = async ({ username, email, password }: RegisterDto) => {
        try {
            // Register in our backend
            const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            // If something went wrong when register backend set Error
            if (!registerResponse.ok) {
                setError(registerResponse.status + " " + registerResponse.statusText)
                return
            }

            // When register backend was ok sign in with next auth
            const response = await signIn("credentials", {
                password,
                email,
                redirect: false
            }) as SignInResponse

            // When everything was ok in next auth sign in go to url we was before register or home
            if (response.ok) {
                router.push(callbackUrl ?? routes.home)
            } else if (response.error) {
                setError(response.error)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return <>
        {/* Register Form */}
        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
            {({ dirty, isValid }) => (
                <Form className="mb-5 lg:mb-10">
                    <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                    <TextInput name="username" labelText="Username" placeholder="Username" />
                    <TextInput name="password" labelText="Password" placeholder="Password" />

                    <Button datacy="register-button" type="submit" disabled={!(dirty && isValid)} className="md:mt-8">Register</Button>
                </Form>
            )}
        </Formik>

        {/* TODO (Zoe-Bot): Add correct error handling */}
        {error && <p className="py-2">Error: {error}</p>}

        {/* Login Text */}
        <div className="flex">
            <p className="mr-2">Already have an account?</p>
            <Button to={routes.account.login} kind="tertiary" isColored>Login</Button>
        </div>
    </>
}

// Sets custom account layout
Register.getLayout = (page: React.ReactElement) => {
    return <AccountLayout page={page} siteTitle="Register" headline="Create your account" description="Start for free." descriptionImage="Register to share your stuff." />
}

// Sets guest route (user need to be logged out)
Register.auth = {
    routeType: "guest"
}

export default Register

