const express = require('express');
const path = require('path');
const router = express.Router();
const sendIndex = (req, res) => res.sendFile(path.join(__dirname, '../public', 'app.html'));

router.get('/', sendIndex);
router.get('/post', sendIndex);
router.get('/post/:postID', sendIndex);
router.get('/post/:postID/edit', sendIndex);
router.get('/game', sendIndex);
router.get('/etc', sendIndex);
router.get('/publish', sendIndex);

module.exports = router;
