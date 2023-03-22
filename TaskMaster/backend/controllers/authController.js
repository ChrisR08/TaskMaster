// Authorisation Controller
const jwt = require(`jsonwebtoken`);

// Import User Schema model
const User = require(`../models/userModel`);

// Import middleware
const { handleErrors } = require(`../middleware/middleware`);

// JWTs ===================================================================

// Creates jwt token using the secret in .env, HS256 encyption and a expiry of 3 days
const createToken = (id) => {
    // Defines max age of tokens and cookies (3 Days in secs)
    const maxAge = 3 * 24 * 60 * 60;

    // Create a token using the userID and secret
    return (token = jwt.sign({ id }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: maxAge,
    }));
};

// =======================================================================

// This function checks for a JWT token in the cookies for auth
const verifyToken = async (req, res, next) => {
    // Get the token from cookie
    const token = req.cookies.jwt;
    const bearer = req.body.authorization;

    // Verify the token using the JWT_SECRET and decode it to get user information
    if (token || bearer) {
        try {
            // Gets the user of the verified token and
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: id }, { password: 0 });
            console.log(`User Verified`);
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ error });
        }
    } else {
        console.log(`No token provided!`);
        res.status(401).json({ msg: `Not verified` });
    }
};

// ========================================================================

// Adds a new user to the database
const signUpUser = async (req, res) => {
    // Destructure the body data
    const { userName, email, password } = req.body.bodyContent;

    // Creates the user object using schema model
    try {
        const user = await User.create({
            userName,
            email,
            password,
            admin: false,
        });

        // Create a JWT passing the user id
        const token = createToken(user._id);
        const user_ID = user._id;

        // Setting the secure cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
        });

        res.status(201).json({ email, token, user_ID });
    } catch (error) {
        // Handle errors
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};

// ========================================================================

// Adds a new user to the database
const logInUser = async (req, res) => {
    // Destructure the body data
    const { userName, password } = req.body.bodyContent;

    try {
        // Use login method created in userModel.js
        const user = await User.login(userName, password);
        if (user) {
            // Create a JWT passing the user id
            const token = createToken(user._id);

            // Setting the secure cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
            });

            if (token) {
                res.status(201).json({
                    user_ID: user._id,
                    token,
                    admin: user.admin,
                });
            }
        } else {
            res.status(404).json({ error: "No user found" });
        }
    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// ========================================================================

// Logs the user out
const logOutUser = async (req, res) => {
    res.cookie("JWT", "", {
        httpOnly: true,
        secure: true,
        sameSite: `none`,
        maxAge: 10,
    });

    console.log(`logged out`);
    res.json({ msg: `User logged out` });
};

// ============================================================================

// Export functions for use in routes
module.exports = {
    signUpUser,
    logInUser,
    logOutUser,
    createToken,
    verifyToken,
};
