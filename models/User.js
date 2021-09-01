const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 사용자 정보를 mongoDB에 save하기 전 
userSchema.pre('save', function( next ){
    var user = this;

    if(user.isModified('password')) {
        // 사용자 비밀번호 암호화 시키기
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return nex(err)

                user.password = hash
                next()
            })
        });
    } else {
        next()
    }
})


const User = mongoose.model('User', userSchema)

module.exports = { User }