const mongoose = require(`mongoose`);
const bcrypt = require(`bcrypt`);

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [8, `Minimum password length is 8 characters`],
            validate: {
                validator: function (value) {
                    return (
                        /[A-Z]/.test(value) &&
                        /[a-z]/.test(value) &&
                        /[0-9]/.test(value) &&
                        /\W/.test(value)
                    );
                },
                message: (props) =>
                    `Password must contain at least one uppercase, one lowercase, one number, and one special character.`,
            },
        },
        admin: {
            type: Boolean,
            default: false,
            required: false,
        },
        theme: {
            type: String,
            required: false,
        },
    },
    { collection: "users", db: "TaskMaster", timestamps: true }
);

// Function to execute when a user is created
// Salting and Hashing the users password to save securely
userSchema.pre(`save`, async function (next) {
    // Generating a salt
    const salt = await bcrypt.genSalt();
    // Creating a salted and hashed password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Login user - Checks passwords entered against the one stored in the db
userSchema.statics.login = async function (userName, password) {
    const user = await this.findOne({ userName });
    // if user is not null, then compare passwords to validate
    if (user) {
        const userAuth = await bcrypt.compare(password, user.password);
        // If authorised then return the user found in the db
        if (userAuth) {
            return user;
        }
        // Else throw incorrect pw error for the user
        else {
            throw Error(`Incorrect Password. Please try again!`);
        }
    }
    // Handle userName not found in db
    else {
        throw Error(`Username is case sensitive. Please check and try again or sign up.`);
    }
};

const User = mongoose.model(`User`, userSchema);

module.exports = User;
