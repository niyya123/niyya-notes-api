const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../api/models/userModel')
const auth = require('../api/middlewares/auth');

module.exports = function (app) {
    // create user
    app.post('/api/register', async function (req, res, next) {
        const { email, username, password } = req.body;
        try {

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'Email already exists' });
            }
            
            user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }


            user = new User({ email ,username, password });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err;
                res.json({ "token" : token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    })

    // login user
    app.post('/api/login', async function (req, res, next) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET, // Ensure this value is set
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ "token" :token,
                                "id": user.id,
                                "username": user.username,
                            "email": user.email});
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    })

    // get authentication user
    app.get('/api/user',auth, async (req, res) => {
        const userId = req.user.id;
        try {
            const user = await User.findById(req.user.id).select('-password')
            console.log('user: ', user);
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });
}