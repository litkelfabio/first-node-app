const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next ) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '')
        const decodedPayload = await jwt.verify(token, 'taskmanagerzzz');
        const user = await User.findOne({_id: decodedPayload._id, 'tokens.token': token});
        if(!user){
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send('Invalid token')
    }
}

module.exports = auth;