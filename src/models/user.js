const mongoose = require('mongoose');
const validator = require('validator')
const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        minLength:7,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        type: String,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain \'password\'')
            }
        }
    },
    //Array token
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true // note the structure
});

//don't use arrow function
userSchema.methods.getAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
}

//data to send to client side
//manual solution
// userSchema.methods.getPublicProfile = function(){
//     const user = this;
//     const userObject = user.toObject()

//     delete userObject.password;
//     delete userObject.tokens
//     return userObject;
// }


//virtual property to virtually related to other collection
//this is not saved in db only on mongoose
userSchema.virtual('tasks', {
    ref:'tasks',
    localField: '_id',
    foreignField: 'ownerID'
})

//preventing to return the password and token everytime requesting the user profile
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//finding if email is existing
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login!')
    }

    const isMatch = await brcypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login!')
    }

    return user;
}

// don't use arrow function
//Checking password before saving
userSchema.pre('save', async function(next){
    const user = this;
    
    //hashing and detecting if the password is modified
    if(user.isModified('password')){
        user.password = await brcypt.hash(user.password, 8);
    }

    next();
});

//delete task when deleting own profile
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({ownerID: user.id})
    next();
})


const User = mongoose.model('user', userSchema);

module.exports = User;