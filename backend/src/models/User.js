import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String,
    required: true,
    minlength: 6
    },
    bio: {
    type: String,
    default: ""
    },
    profilePic:{
    type: String,
    default: ""
    },
    location:{
    type: String,
    default: ""
    },
    isOnboarded:{
    type: Boolean,
    default: false
    },
    isVerified:{
    type: Boolean,
    default: false
    },
    lastLogin:{
    type: Date,
    default: Date.now
    },
    friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    }],
    friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
    posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  resetPasswordToken:{
    type: String
  },
  resetPasswordExpires:{
    type: Date
  },
  verificationToken:{
    type: String
  },
  verificationTokenExpires:{
    type: Date
  },

}, { timestamps: true });


userSchema.pre('save', async function(next) {

    if(!this.isModified('password')){
        return next();
    }
    try{
        const salt  = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(err){
        next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;