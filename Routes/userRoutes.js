const express = require('express')
const userRouter = express.Router()

const userController = require('./../controllers/userController')

userRouter.route('/').get(userController.getAllUsers).post(userController.CreateUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.UpdateUser)
  .delete(userController.DeleteUser);

  module.exports = userRouter