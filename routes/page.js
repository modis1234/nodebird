const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


const router = express.Router();

/**
 * @description 라우터용 미들웨어를 만들어 템플릿 엔진에서 사용한 res.locals 설정
 */
router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' })
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' })
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits
    })
});

module.exports = router;