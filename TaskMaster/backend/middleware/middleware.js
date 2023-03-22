const jwt = require(`jsonwebtoken`);

// Error Handling  & Validation ===============================================

// Handling errors and sending back relevent msgs
const handleErrors = (err) => {
    console.log(err.message, err.code);
    // Initialise errors array to store msgs
    let errors = { email: `None`, password: `None` };

    // Duplicate error code
    if (err.code === 11000) {
        errors.email = `That email address is already registered!`;
        return errors;
    }

    // Validation errors. Extracts the specific error and populates errors
    if (err.message.includes(`User validation failed:`)) {
        Object.values(err.errors).forEach((error) => {
            let props = error.properties;
            let errMsg = "";
            // Makes frontend msg readable
            if (props.message.includes("Path `password` is required.")) {
                errMsg = "Password is required & must be at least 8 characters!";
            } else if (props.message.includes("Minimum password length")) {
                errMsg = "Minimum password length is 8 characters!";
            } else if (
                props.message.includes("Password must contain at least one uppercase")
            ) {
                errMsg =
                    "Password must contain at least one uppercase, one lowercase, one number, and one special character.";
            } else {
                errMsg = props.message;
            }
            errors[props.path] = errMsg;
        });
    }
    return errors;
};

// Validates the content type
const checkContentType = async (req, res, next) => {
    try {
        const contentType = await req.headers[`content-type`];
        if (!contentType || !contentType.includes("application/json")) {
            return res
                .status(400)
                .json({ error: "Content type must be: application/json" });
        }
    } catch (err) {
        console.log(err);
    }
    console.log(`Content-Type Check - Passed`);
    next();
};

// Export functions
module.exports = {
    handleErrors,
    checkContentType,
};
