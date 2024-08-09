const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../api/models/userModel')
const auth = require('../api/middlewares/auth');
const admin = require('firebase-admin')
const multer = require('multer');
var key = require('../config/niyya-notes-firebase-adminsdk-fggb6-c6a0155f93.json')

module.exports = function (app) {

    const bucket = admin.storage().bucket();
    // // Multer setup
    const storage = multer.memoryStorage();
    const upload = multer({ storage });


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


            user = new User({ email ,username, password,avatarUrl:'' });
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

    // update avatar user
    app.patch('/api/user/avatar/:id',auth,upload.single('image'), async (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const { id } = req.params;

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const file = bucket.file(fileName);

        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        stream.on('error', (err) => {
            console.error(err);
            res.status(500).send(err);
        });

        stream.on('finish', async () => {
            await file.makePublic();
            const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            const update = {avatarUrl: url}
            const user = await User.findByIdAndUpdate(id,update,{new:true})
            if (!user) {
                return res.status(404).send('Document not found.');
            }
            res.send({
                code:200
            });
        });

        stream.end(req.file.buffer);
    })
}