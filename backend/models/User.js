import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        cartData: {
            type: Object,
            default: {}
        }
    },
    { timestamps: true, minimize: false }
)

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

// compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password)
    return isPasswordCorrect
}

export default mongoose.model.User || mongoose.model("User", UserSchema)