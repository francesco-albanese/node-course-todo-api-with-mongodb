const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

/******* 
 * 
 * statics are the methods defined on the Model. methods are defined on the document (instance)
 * 
 * *********/

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

UserSchema.pre('save', function(next) {
    const user = this
    const password = user.password

    //we only want to encrypt the password if it has been modified
    if (user.isModified('password')) {
        bcrypt.genSalt(10).then(salt => salt)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
            user.password = hash 
            next()
        })
        .catch(e => next(e))
    } else {
        next()
    }

})

const User = mongoose.model('User', UserSchema)

module.exports = { User }