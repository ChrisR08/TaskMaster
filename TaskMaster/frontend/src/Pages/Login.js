import React, { useState } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { useNavigate } from "react-router-dom";

// Express API URL
import apiURL from "../apiConfig";

// Components
import Header from "../Components/globalComponents/Header/Header";

// CSS
import "./forms.css";

function Login() {
    // Creating an instance of useNavigate
    const navigate = useNavigate();

    // Making userContext available
    const { isNewUser, dispatchUser } = useUserContext();

    // Handle user clicking on the Sign up here! link
    const handleCLickText = () => {
        dispatchUser({ type: `SET_ISNEWUSER`, payload: !isNewUser });
        // Ensures any previous errors are cleared from state
        setErrors({
            emailError: "",
            passwordError: "",
        });
    };

    // To display the current page title as the nav heading
    let pageTitle = isNewUser ? "Sign Up" : "Log In";

    // To sent the POST request to the correct URL
    let postURL = isNewUser ? `${apiURL}/auth/signup` : `${apiURL}/auth/login`;

    // Setting the condition based form text values
    const wrongPageText = isNewUser ? "Already registered... " : "Not registered yet... ";
    const wrongPageBtnText = isNewUser ? "Log In here!" : "Sign Up here!";

    // ========================================================================

    // Setting up the useState for the data from inputs in the login form
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
    });

    // Setting up the useState for error handling
    const [errors, setErrors] = useState({
        userNameError: "",
        emailError: "",
        passwordError: "",
    });

    // ========================================================================

    // Gets the name of the input and the value and sets them in formData
    const handleInputs = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // ========================================================================

    // Handle the form submission
    const handleSubmit = async (e, postURL) => {
        e.preventDefault();

        // Ensures any previous errors are cleared from state
        setErrors({
            userNameError: "",
            emailError: "",
            passwordError: "",
        });

        // Destructuring the form data
        const { userName, email, password } = formData;

        // Set the body content based on the request url
        const bodyContent =
            postURL === `${apiURL}/auth/login`
                ? {
                      userName: userName,
                      password: password,
                  }
                : {
                      userName: userName,
                      email: email,
                      password: password,
                  };

        try {
            const response = await fetch(postURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // To be sent in the body to the backend
                body: JSON.stringify({ bodyContent }),
            });
            const data = await response.json();

            // If user is returned then all checks have passed and auth is granted
            if (data.token) {
                localStorage.setItem(`userVerified`, true);
                dispatchUser({ type: `SET_IS_USER_VERIFIED`, payload: true });
                dispatchUser({ type: `SET_ISNEWUSER`, payload: false });
                dispatchUser({ type: `SET_USER_ID`, payload: data.user_ID });

                dispatchUser({ type: `SET_USER_TOKEN`, payload: data.token });
                if (userName) {
                    dispatchUser({ type: `SET_USERNAME`, payload: userName });
                }
                if (data.admin === true) {
                    dispatchUser({ type: `SET_ISUSERADMIN`, payload: true });
                } else {
                    dispatchUser({ type: `SET_ISUSERADMIN`, payload: false });
                }

                // Redirect the user to the home page
                navigate("/dashboard");
            }

            // Handle Sign up Errors
            // If an error is returned then show the error to the user
            if (data.errors && data.errors.email) {
                setErrors({
                    errors,
                    emailError: data.errors.email,
                });
            }
            if (data.errors && data.errors.userName) {
                setErrors({
                    errors,
                    userNameError: data.errors.userName,
                });
            }
            if (data.errors && data.errors.passwrod) {
                setErrors({
                    errors,
                    passwordError: data.errors.password,
                });
            }

            // Handle Log In Errors
            // If an error is returned then show the error to the user
            if (data.error && data.error.includes(`Username`)) {
                setErrors({
                    userNameError: data.error,
                });
            } else if (data.error && data.error.includes(`Password.`)) {
                setErrors({
                    passwordError: data.error,
                });
            }
        } catch (error) {
            console.log({ error: error });
        }
    };

    // ========================================================================

    return (
        <>
            <Header pageTitle={pageTitle} />
            <main className="site-container form-wrapper flex flex-col">
                {/* Login or Signup form based on isNewUser */}
                <form className="login-form flex flex-col even-spacing-m border-radius-m">
                    <h2 className="h-l">{pageTitle}</h2>
                    {isNewUser ? (
                        <div className="form-group flex flex-col even-spacing-xs">
                            <label className="form-label h-s" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="input body-l border-radius-m"
                                type="email"
                                name="email"
                                placeholder="someone@gmail.com"
                                value={formData.email}
                                autoComplete="email"
                                onChange={handleInputs}
                                required
                            />
                            {/* Displays email errors */}
                            <p className="error text-error">{errors.emailError}</p>
                        </div>
                    ) : null}
                    <div className="form-group flex flex-col even-spacing-xs">
                        <label className="form-label h-s" htmlFor="userName">
                            Name
                        </label>
                        <input
                            className="input body-l border-radius-m"
                            type="text"
                            name="userName"
                            placeholder="Chris"
                            value={formData.userName}
                            autoComplete="username"
                            onChange={handleInputs}
                            required
                        />
                        {/* Displays userName errors */}
                        <p className="error text-error">{errors.userNameError}</p>
                    </div>
                    <div className="form-group flex flex-col even-spacing-xs">
                        <label className="form-label h-s" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="input body-l border-radius-m"
                            type="password"
                            name="password"
                            placeholder="********"
                            value={formData.password}
                            autoComplete="current-password"
                            onChange={handleInputs}
                            required
                        />
                        {/* Displays password errors */}
                        <p className="error text-error">{errors.passwordError}</p>
                    </div>

                    <button
                        type="submit"
                        className="form-btn bg-primary h-s text-white letter-spacing-s border-radius-m"
                        onClick={(e) => {
                            handleSubmit(e, postURL);
                        }}
                    >
                        {pageTitle}
                    </button>
                    <p className="login-link">
                        {wrongPageText}
                        <button type="button" className="link" onClick={handleCLickText}>
                            {wrongPageBtnText}
                        </button>
                    </p>
                </form>
            </main>
        </>
    );
}

export default Login;
