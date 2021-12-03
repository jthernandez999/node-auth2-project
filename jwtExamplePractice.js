const jwt = require('jsonwebtoken');

const { router } = require('./api/server');

router.post('/login', (req, res, next) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.status(200).json({ 
                message: `Welcome ${user.username}!, here is your token....`,
                token
            })
        } else {
            res.status(401).json({ message: 'Invalid Credentials!' })
        }
    })
    .catch(err => {
        res.staus(500).json(err)
    })
})

function generateToken(user) {
    const payload = {
        subject: user.id, 
        username: user.username
    }
    const options = {
        expiresIn: '30d'
    }
    return jwt.sign(payload, secrets.jwtSecret, options); 
}

// inside config folder file named secret.js

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'Shh, its a secret'
}