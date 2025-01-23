import mongoose from "mongoose";
import bcrypt from "bcrypt";

//Define Schmea for users
const userSchema = new mongoose.Schema(
    {
        name: {
            type : String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },
    },

    { timestamps: true } // Enable timestamps
);

// .pre() or .post() method is used to define middleware 
// that runs before/after a specific Mongoose operation is executed.

userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8);
    }

    next();
});

// user collection for storing users
const User = mongoose.model('User',userSchema);
export default User;
