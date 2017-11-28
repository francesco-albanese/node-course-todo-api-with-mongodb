const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address!'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

//override a method

UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    
    return _.pick(userObject, ['_id', 'email'])
}

//creating a method to be appended to the UserSchema obj
UserSchema.methods.generateAuthToken = function() {
    const user = this
    const access = 'auth'
    const _id = user._id.toHexString()
    const token = jwt.sign({_id, access}, 'abc123').toString()

    user.tokens.push({ access, token })

    return user.save().then(() => token)
}

UserSchema.statics.findByToken = function(token) {
    const User = this
    let decoded = undefined
    
    try {
        decoded = jwt.verify(token, 'abc123')
    } catch(e) {
        return Promise.reject()
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

const User = mongoose.model('User', UserSchema)

module.exports = { User }