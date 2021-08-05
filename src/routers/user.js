const express = require('express');
const User = require('../models/user')
const router = new express.Router();
const auth = require('../middlewares/auth')
const multer = require('multer');
const sharp = require('sharp')

//add user
router.post('/user', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.getAuthToken();
        // res.status(201).send({"user": user.getPublicProfile(), token}) // manual solution
        res.status(201).send({user, token}); //
    }catch(e){
        res.status(400).send(e)
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send(e);
    }

})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(400).send(error)
    }
});

//setting the auth for 2nd arg to require authentication
router.get('/me', auth, async (req, res) => {
    res.send(req.user)
});

//setting the auth for 2nd arg to require authentication
router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e)
    }
});

//updating own profile
router.patch('/user/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowToUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowToUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send('Error: Invalid fields!');
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();

        if(!req.user){
            return res.status(404).send();
        }
        res.send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
})

//updating by id
router.patch('/user/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowToUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowToUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send('Error: Invalid fields!');
    }
    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        // const user = await User.findByIdAndUpdate({_id}, req.body, {new: true, runValidators: true} );
        // console.log(req.body);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(500).send(e);
    }
});

//deleting own profile
router.delete('/user/me', auth, async (req, res) => {
    try{
        await req.user.remove();
        res.send(req.user);
    }catch(e) {
        res.status(500).send(e)
    }
});


router.delete('/user/:id', auth, async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send();
        }

        res.send(user);
    }catch(e) {
        res.status(500).send(e)
    }
});

//uploading of file
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload only image'));
        }

        cb(undefined, true);
    }
});

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer(); // lowering the resolution
    req.user.avatar = buffer;
    await req.user.save();
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

//deleting image
router.delete('/delete/me/avatar', auth, async(req, res) => {
    try {
        req.user.avatar = null;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e)
    }
}, (error, req, res, next) => {
    res.status(500).send(error)
});

//serving file
router.get('/user/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error('Error occured!')
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send(e)
    }
})


module.exports = router;