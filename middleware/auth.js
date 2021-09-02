const { User } = require('../models/User')

let auth = (req, res, next) => {
    // 인증 처리

    // 1. 클라이언트 쿠키에서 토큰을 가져옴 <- cookie-parser 이용
    let token = req.cookies.x_auth;

    // 2. 토큰을 디코드한 후 유저를 찾는다
    //    유저가 있으면 인증 O
    //    유저가 없으면 인증 X
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = {auth};
