
# 9장 익스프레스로 SNS 서비스 만들기
<!-- 인프런의 [타입스크립트 입문 - 기초부터 실전까지](https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9E%85%EB%AC%B8?inst=f1ae9299&utm_source=blog&utm_medium=githubio&utm_campaign=captianpangyo&utm_term=banner) 온라인 강의 리포지토리입니다.

[![typescript-beginner](https://joshua1988.github.io/images/posts/web/inflearn/typescript-beginner-kor.png)](https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9E%85%EB%AC%B8?inst=f1ae9299&utm_source=blog&utm_medium=githubio&utm_campaign=captianpangyo&utm_term=banner) -->

## NodeBird
##### 9.1 프로젝트 구조 갖추기(p397)
 1. `npm i sequelize mysql2 sequelize-cli`
 2. `npx sequelize init` config, migrations,models, seeders 폴더가 생성
   ** npx 명령어를 사용하는 이유는 전역 설치(npm i -g)를 피하기 위해서다.
 3. 템플릿 파일을 넣을 views 폴더, 라우터를 넣을 routes 폴더, 정적파일을 넣을 public 폴더 생성
 4. 익스프레스 서버 코드가 담길 app.js 
    설정값들을 담을 .env 파일을 nodebird 폴더 안에 생성 
 5. npm 패키지 설치 및 app.js에 작성
   `npm i express cookie-parser express-session morgan multer dotenv nunjucks`
   `npm i -D nodemon`
   **nunjucks(뷰엔진) :  
 6. app.js 작성 **(node.js 교과서 P399 참고)** 
 7. .env 파일에 `COOKIE_SECRET=cookiesecret` 작성
 8. 프로젝트 파일 생성
   > routes
    &emsp;|--page.js
   
   > views
    &emsp;|--layout.html
    &emsp;|--main.html
    &emsp;|--profile.html
    &emsp;|--join.html
    &emsp;|--error.html
    
   > public
    &emsp;|--main.css
 9. routes/page.js 라우터 작성 **(node.js 교과서 P401 참고)**
 10. .html, .css 파일 작성 (https://github.com/ZeroCho/nodejs-book.git 복사 추천) 
 11. npm start로 서버 실행하고  http://localhost:8001에 접속하면 <node.js 교과서 그림 9-3(p410)> 출력
  ##### 9.2 데이터베이스 세팅하기(p410) - MySQL과 시퀄라이즈로 데이터베이스를 설정
 12. models 폴더 안에 user.js / post.js / hashtag.js 생성
   > models
    &emsp;|--user.js
    &emsp;|--post.js
    &emsp;|--hashtag.js
 13. 사용자 정보 모델 생성 - `models/user.js` 작성 **(node.js 교과서 P401 참고)**
   **사용자 정보를 저장하는 모델.
   **테이블 옵션으로 timestamps와 paranoid가 true로 주어졌으므로 createdAt, updateAt, deleteAt 컬럼도 생성
```javascript
const Sequelize = require('sequelize');
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            provider: {
                type: Sequelize.STRING(40),
                allowNull: false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static associate(db) {}
};
```
14. 게시글 모델 생성 - `models/post.js` 파일 생성 및 코드 작성 **(node.js 교과서 P412 참고)**
** 게시글 모델은 게시글 내용과 이미지 경로를 저장
** 게시글 등록자의 아이디를 담은 컬럼은 나중에 관계를 설정할 때 시퀄라이즈가 알아서 생성
```javascript
const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(40),
                allowNull: false
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8md4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){}
};
```
15. 해시태그 모델 생성 - `models/hashtag.js` 파일 생성 및 코드 작성 **(node.js 교과서 P412 참고)**
** 해시태그 모델은 태그 이름을 저장
** 해시태그 모델을 따로 두는 것은 나중에 태그로 검색하기 위함
```javascript
const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    };

    static associate(db) { }
};
```

15. 생성한 모델들을 시퀄라이즈에 등록 `models/index.js`에 자동으로 생성한 코드 아래 코드로 변경 **(node.js 교과서 P413 참고)**
** 각각의 모델들을 시퀄라이즈 객체에 연결
```javascript
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.passwor0d, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.sequelize(db);
Post.sequelize(db);
Hashtag.sequelize(db);

module.exports = db;
```
16. 각 모델 간의 관계를 associate 함수 안에
 정의 **(node.js 교과서 P414 참고)**

```javascript
<models/user.js>
... 
static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
        foreignKey: 'followingId',
        as: 'Followers',
        through: 'Follow'
    });
    db.User.belongsToMany(db.User, {
        foreignKey: 'followerId',
        as: 'Followings',
        through: 'Follow'
    })
}
...
```
** as에 특정한 이름을 지정했으니 user.getFollowers, user.getFollowings 같은 관계 메서드를 사용할 수 있다.
** include 시에도 as에 같은 값을 넣으면 관계 쿼리가 작동

17. models/post.js Post 모델에 관계 작성
```javascript
<models/post.js>
... 
static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
    }
...
```
+ User 모델과 Post 모델은 1(User):N(Post) 관계이므로 belongsTo로 연결
+ 시퀄라이즈는 Post 모델에 User 모델의 id를 가르키는 UserId 컬럼을 추가

18. 생성한 모델을 데이터베이스 및 서버와 연결,
    1) 데이터베이스 생성-이름 `nodebird`
    2) `config.json` 수정 
    ```javascript
    ...
        "development": {
        "username": "admin",
        "password": "work1801!@",
        "database": "nodebird",
        "host": "127.0.0.1",
        "port": 3336,
        "dialect": "mysql"
    },
    ...
    ```
    3) 콘솔에서 `npx sequelize db:create`명령어를 입력해 데이터베이스 생성
    4) app.js에서 모델을 서버와 연결
    ```javascript
    <<app.js>>
    const { sequelize } = require('./models);
    ...
    nunjucks.configure('views', {
        express: app,
        watch: true
    });
    sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공')
    })
    .catch(err => {
        console.error(err);
    });

    app.use(morgan('dev'));
    ...
    ```
***
##### 9.3 Passport 모듈로 로그인 구현하기(p397)
- Passport 관련 패키지 설치
`npm i passport passport-local passport-kakao bcrypt`
1. Passport 모듈을 미리 app.js 연결
```javascript
...
const pageRouter = require('./routes/page');
const { sequelize } = require('./models');
//passport 모듈 연결
const passportConfig = require('./passport')
...
const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT | 8001);
app.set('view engine', 'html');
...
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}))

app.use(passport.initialize()); // 미들웨어는 요청(req 객체)에 passport 설정을 심고,
app.use(passport.session()); // req.session객체에 passport 정보를 저장
                            // req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결
app.use('/', pageRouter)
```
19. passport 폴더 내부에 index.js 파일을 만들고 Passport 관련 코드를 작성
```javascript
<<passport/index.js>>

const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { // 로그인 시 실행되며, req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
        done(null, user.id); // 매개변수로 user를 받고 나서, done 함수에 두번째 인수로 user.id를 넘기고 있다. 
    });

    passport.deserializeUser((id, done) => { // 매 요청 시 실행, password.session 미들웨어가 이 메서드 호출 
        User.findOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err))
    });

    local();
    kakao();
};
```
- 전체 과정
    + 라우터를 통해 로그인 요청이 들어옴
    + 라우터에서 passport.authenticate 메서드 호출
    + 로그인 전략 수행
    + 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
    + req.login 메서드가 passport.serializeUser 호출
    + req.session에 사용자 아이디만 저장
    + 로그인 완료
  ** 1~4번은 아직 구현 되지 않음, 로컬 로그인을 구현하면서 상응하는 코드를 작성하게 됨
- 로그인 이후의 과정
    + 요청이 들어옴
    + 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser메서드 호출
    + req.session에 저장 된 아이디로 데이터베이스에서 사용자 조회
    + 조회된 사용자 정보를 req.user에 저장
    + 라우터에서  req.user 객체 사용 가능 

##### 9.3.1 로컬 로그인 구현하기(p422)
- 로컬 로그인이란 다른 SNS 서비스를 통해 로그인하지 않고 자체적으로 회원가입 후 로그인하는 것을 의미
- Passport에서 이를 구현하려면 passport-local 모듈이 필요
- 회원가입, 로그인, 로그아웃 라우터 만들기
** 로그인한 사용자는 회원가입과 로그인 라우터에 접근하면 안된다.
** 로그인하지 않은 사용자는 로그아웃 라우터에 접근하면 안된다. 
**--> 라우터에 접근 권한을 제어하는 미들웨어가 필요**

20. 라우터에 접근 권한을 제어하는 middlewares.js에  미들웨어 만들기 **(node.js 교과서 P423 참고)**
```javascript
<<routes/middlewares.js>>

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요')
    }
};

exports.isNotLoggeIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`)
    }
}
```
21. routes/page.js에 isLoggedIn과 isNotLoggedIn 미들웨어에 연결
```javascript
<<routes/page.js>>

const express = require('express');
const { isLoggedIn, isNotLoggeIn } = require('./middlewares');

const router = express.Router();
...

router.get('/profile', isLoggedIn, (req, res) => {  // isLoggedIn 미들웨어에서 req.isAuthenticated가 true 이면 다음 미들웨어 실행, false 이면 로그인 창이 있는 메인 페이지로 리다이렉트
    res.render('profile', { title: '내 정보 - NodeBird' })
});

router.get('/join', isNotLoggeIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' })
});
...
```

22. 회원가입, 로그인, 로그아웃 라우터 작성 **(node.js 교과서 P424 참고)**
** routes 폴더에 auth.js 파일 생성
```javascript
<<routes/auth.js>>

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggeIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { emali, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { emali } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); //bcrypto 두번쨰 인수는 pdkdf2의 반복 횟수와 비슷한 기능을 한다.
        await User.create({
            email,
            nick,
            password: hash
        })
    } catch (error) {
        console.error(error);
        return next(error);
    }
}); // 회원가입 라우터

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError)
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다
    })
}); // 로그인 라우터

router.get('/logout', isLoggedIn, (req, res)=>{
    req.logOut();
    req.session.destroy();
    res.redirect('/');
}); // 로그아웃 라우터

module.exports = router;
```
+ **회원가입 라우터**
기존에 같은 이메이로 가입한 사용자가 있는지 조회한 뒤, 있다면 회원가입 페이지로 되돌려보냅니다. 단 주소뒤에 에러를 쿼리스트링으로 표시
같은 이메일로 가입한 사용자가 없다면 비밀번호를 암호화하고, 사용자 정보를 생성
회원가입 시 비밀번호는 암호화해서 저장해야한다. 
bcrypt 모듈을 사용(crypto 모듈의 pbkdf2 메서드를 사용해 암호화할 수 있다.). 
bcrypt 모듈의 hash메서드를 사용하면 손쉽게 비밀번호를 암호화 할 수 있다.
bcrypto 두번쨰 인수는 pdkdf2의 반복 횟수와 비슷한 기능을 한다.
숫자가 커질수록 비밀번호를 알아내기 어려워지지만 암호화 시간도 오래 걸린다.
12 이상을 추천하며, 31까지 사용할 수 있다. 프로미스를 지원하는 함수이므로 await를 사용
+ **로그인 라우터**
로그인 요청이 들어오면 passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행한다.
**미들웨어인데 라우터 미들웨어 안에 들어있다.** 미들웨어에 사용자 정의 기능을 추가하고 싶을 때 이렇게 할 수 있다. 이럴 때는 내부 미들웨어에 (req, res, next)를 인수로 제공해서 호출하면 된다.
전략 코드는 잠시 후에 작성. 전략이 성공하거나 실패하면 authenticate 메서드의 콜백 함수가 실행 된다. 콜백 함수의 첫번쨰 매개변수(authErr) 값이 있다면 실패한 것이다.
두번째 매개변수 값이 있다면 성공한 것이고, req.login 메서드를 호출합니다.
Passport는 req 객체에 login과 logout 메서드를 추가한다. req.login은 passport.serializeUser를 호출한다.
req.login에 제공하는 user 객체가 serializeUser로 넘어가게 된다.
+ **로그아웃 라우터**
req.logout 메서드는 req.user 객체를 제거하고, req.session.destroy는 req.session 객체의 내용을 제거합니다.
세션 정보를 지운 후 메인 페이지로 되돌아가빈다. 로그인 해제되어 있을 것입니다.
**<node.js 교과서 P425 내용>**

23. passport-local 모듈에서 Strategy 생성자를 불러와 로그인 전략 구현 **(node.js 교과서 P427 참고)**
```javascript
<<passport/localStrategy.js>>

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    // 1. 로그인 성공 시
                    done(null, exUser);
                    /**
                     *                             done( null,   exUser)
                     *                                    ↓        ↓
                     * passport.authenticate('local', (authError, user, info))
                     */ 
                } else {
                    // 2. 로그인 실패 시
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                     /**
                     *                                  null      false  { message: '비밀번호가 일치하지 않습니다.' }
                     *                                    ↓        ↓       ↓
                     * passport.authenticate('local', (authError, user, info))
                     */ 
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' })
            }
        } catch (error) {
            // 3. 서버 에러시
            console.error(error);
            done(error);
            /**
             *                                  error
             *                                    ↓        
             * passport.authenticate('local', (authError, user, info))
             */ 
        }
    }));
}
```
+ LocalStrategy 생성자의 첫번째 인수로 주어진 객체는 전략에 관한 설정하는 곳이다.
usernameField와 passwordField에는 일치하는 로그인 라우터의 req.body 속성명을 적으면 된다.
req.body.email에 이메일 주소가, req.body.password에 비밀번호가 담겨 들어오므로 email과 password를 각각 넣는다.
+ 실제 전략을 수행하는 async 함수이다. LocalStrategy 생성자와 두 번째 인수로 들어간다.
첫번째 인수에서 넣어준 email과 password는 각각 async 함수의 첫번쨰와 두번째 매개변수가 된다. 세번째 매개변수인 done함수는 passport,authenticate의 콜백 함수 이다.
+ done이 호출 된 후에는 다시 passport.authenticate의 콜백 함수에서 나머지 로직이 실행됩니다. 로그인이 성공했다면 메인 페이지로 리다렉트되면서 로그인 폼 대신 회원 정보가 뜰 것이다.
아직 auth 라우터를 연결하지 않았으므로 코드가 동작하지 않는다.
**<node.js 교과서 P427 내용>**

<br/>

#### 9.3.2 카카오 로그인 구현하기 **(Nodejs 교과서 P428)**<hr/>
+ 카카오 로그인이란 로그인 인증 과정을 카카오에 맡기는 것을 뜻한다.
+ 사용자는 번거롭게 새로운 사이트에 회원가입하지 않아도 되므로 좋고, 서비스 제공자는 로그인 과정르 검증된 SNS에 안심하고 맡길 수 있어 좋다.
+ SNS 로그인의 특징은 회원가입 절차가 따로 없다는 것이다. 처음 로그인 할 때는 회원가입 처리를 해야 하고, 두 번째 로그인부터는 로그인 처리를 해야한다. 따라서 SNS 로그인 전략은 로컬 로그인 전략보다 다소 복잡하다.

24. passport-kakao 모듈로부터 Strategy 생성자를 불러와 전략을 구현 **(node.js 교과서 P429 참고)**
```javascript
<<passport/kakaoStrategy.js>>

const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passsport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' }
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
```
+ 로컬 로그인과 마찬가지로 첫번쨰 인자는 카카오 로그인에 대한 설정이다. clientID는 카카오에서 발급해주는 아이디이다. 
노출되지 않아야 하므로 process.env.KAKAO_ID로 설정했다.
나중에 아이디를 발급받아 .env 파일에 넣을 것이다.
callbackURL은 카카오로부터 인증 결과를 받을 라우터 주소이다. 
아래에서 라우터를 작성할 때 이 주소를 사용한다.
+ 먼저 기존에 카카오를 통해 회원가입한 사용자가 있는지 조회한다.
있다면 이미 회원가입되어 있는 경우이므로 사용자 정보와 함께 done 함수를 호출하고 전략을 종료한다.
+ 카카오를 통해 회원가입한 사용자가 없다면 회원가입을 진행한다.
카카오에서는 인증 후 callbackURL에 적힌 주소로 accessToken, refreshToken과 profile을 보낸다.
profile에는 사용자 정보들이 들어있다. 카카오에서 보내주는 것이므로 데이터는 console.log 메서드로 확인해 보는 것이 좋다.
pofile 객체에서 원하는 정보를 꺼내와 회원가입을 하면 된다. 사용자를 생성한 뒤 done함수를 호출한다.
**<node.js 교과서 P429 내용>**

25. 카카오 로그인 라우터
```javascript
<<routes/auth.js>>

...
// 카카오 로그인 라우터
router.get('/kakao', passport.authenticate('kakao')); //GET 라우터에 접근하면 카카오 로그인 과정이 시작
                                                      // layout.html의 카카오톡 버튼에 /auth/kakao 링크가 붙어 있다.

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;
```
+ GET /auth/kakao로 접근하면 카카오 로그인 과정이 시작 된다. layout.html의 카카오톡 버튼에 /auth/kakao 링크가 붙어 있다.
+ GET /auth/kakao에서 로그인 전략을 수행하는데, 처음에는 카카오 로그인 창으로 리다이렉트한다.
+ 그 창에서 로그인 후 성공 여부 결과를  GET /auth/kakao/callback 으로 받는다.
+ 이 라우터에서는 카카오 로그인 전략을 다시 수행한다.
+ 로컬 로그인과 다른 점은 passport.authenticate 메서드에 콜백 함수를 제공하지 않는다는 점이다.
+ 카카오 로그인은 로그인 성공 시 내부적으로 req.login을 호출하므로 우리가 직접 호출할 필요가 없다.
+ 콜백 함수 대신 로그인에 실패했을 때 어디로 이동할지를 failureRedirect 속성에 적고, 성공 시에도 어디로 이동할지를 다음 미들웨어에 적는다.
**<node.js 교과서 P430 내용>**

26. 추가한 auth 라우터를 app.js에 연결
```javascript
<<app.js>>

...
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
...
app.use('/', pageRouter)
app.use('/auth', authRouter)
...
```

27. kakaoStrategy.js에서 사용하는 clientId를 발급
- 카카오 로그인을 위해서 카카오 개발자 계정과 카카오 로그인용 애플리케이셔 등록 필요
- https://developers.kakao.com 에 접속하여 카카오 회원가입 또는 로그인

## 예제 샘플
예제 : https://github.com/ZeroCho/nodejs-book.git

***
## 개발 환경

<!-- - [Chrome](https://www.google.com/intl/ko/chrome/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js LTS 버전(v10.x 이상)](https://nodejs.org/ko/)
- [Git](https://git-scm.com/downloads) -->

<!-- 💡 참고 사항 : 수업에서는 VSCode를 기준으로 설명합니다. 별도로 선호하시는 IDE가 있다면 그걸 쓰셔도 괜찮습니다 😄 -->

## VSCode 플러그인 목록

<!-- - 색 테마 : [Night Owl](https://marketplace.visualstudio.com/items?itemName=sdras.night-owl)
- 파일 아이콘 테마 : [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- 문법 검사 : ESLint, [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
- 실습 환경 보조 : [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- 기타
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager), [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag), [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens), [Atom Keymap](https://marketplace.visualstudio.com/items?itemName=ms-vscode.atom-keybindings), [Jetbrains IDE Keymap](https://marketplace.visualstudio.com/items?itemName=isudox.vscode-jetbrains-keybindings) 등 -->

## License & Copyright

