const express = require('express');
const router = express.Router();
const expressJWT = require('express-jwt');

const userController = require('../app/api/controller/user');
const config = require("../config");
const db = config.db;



router.get('/testing', userController.testing)
router.post('/login', userController.login)

router.get('/messages',expressJWT({secret: config.secret}), userController.getMessages)
router.post('/messages',expressJWT({secret: config.secret}), userController.insertMessage)
router.delete('/messages/:id',expressJWT({secret: config.secret}), userController.deleteMessage)
router.patch('/messages/:id',expressJWT({secret: config.secret}), userController.updateMessage)

router.get('/users',expressJWT({secret: config.secret}), userController.getUser)




module.exports = router;
