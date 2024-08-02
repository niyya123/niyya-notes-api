const auth = require('../api/middlewares/auth')
var Images = require('../api/models/imageModel')
const multer = require('multer');
const { bucket } = require('../config/firebase');


module.exports = function (app) {
    //Firebase

    // try {
    //     admin.initializeApp({
    //         credential: admin.credential.cert(key),
    //         storageBucket: "niyya-notes.appspot.com" // replace with your Firebase project's storage bucket
    //     });
    //     console.log('Firebase Admin SDK initialized successfully');
    // } catch (error) {
    //     console.error('Error initializing Firebase Admin SDK:', error);
    // }
  

    // const bucket = admin.storage().bucket();

    // Multer setup
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

    // Image upload endpoint
    app.post('/api/gallery/upload', upload.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { author } = req.body; // Extract author from request body

        if (!author) {
            return res.status(400).send('Author is required.');
        }


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

            const newImage = new Images({ fileName, originalName: req.file.originalname, url : url, author : author});
            newImage.save()
                .then(image => res.json({
                    code: 200,
                    fileName,
                    originalName: req.file.originalname,
                    url : url,
                    author : author
                }))
                .catch(err => res.status(500).send(err));
        });

        stream.end(req.file.buffer);
    });

    // Get images
    app.get('/api/gallery',auth,async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 15;
            const temp = await Images.countDocuments({
                author : req.query.author? req.query.author : {$exists: true}  // Optional: filter by author
            })
            Images.find({
                author : req.query.author? req.query.author : {$exists: true}  // Optional: filter by author
            }).skip((page - 1) * pageSize).limit(pageSize).then(async image => {
                const totalPages = Math.ceil(temp / pageSize);
                res.json({
                    "page": page,
                    "pageSize": pageSize,
                    "totalItems": temp,
                    "totalPages": totalPages,
                    "images": image
                })
            }).catch(err => {
                throw err;
            })
        } catch (error) {
            
        }
    })

    //Delete Images
    app.delete('/api/gallery/:id',auth,async (req, res) => {
        const { id } = req.params;
        try {
            const image = await Images.findById(id);
            if (!image) {
                return res.status(404).json({ message: 'Image not found' });
            }

            const file = bucket.file(image.fileName);
            await file.delete();

            await Images.findByIdAndDelete(id);
            res.status(200).json({ message: 'Image deleted successfully' ,code:'200'});
        } catch (error) {
            console.error('Error deleting image:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })
}