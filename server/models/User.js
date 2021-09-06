const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
                if(err) return next(err)

                user.password = hash
                next()
            })
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    // plainPassword 1234567 -- 암호화된 비밀번호 $2b$10$1qAFmfnP6KA39F
    // -> plainPassword를 암호화한 다음 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err),
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken 이용해서 token 생성
    // user._id (DB에 존재하는 ID) + "secretToken" = token
    var token = jwt.sign(user._id.toHexString(), "secretToken") 

    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode함
    jwt.verify(token, 'secretToken', function (err, decoded) {
        
        //유저 아이디를 이용해서 유저를 찾은 다음
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({'_id': decoded, 'token': token}, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }