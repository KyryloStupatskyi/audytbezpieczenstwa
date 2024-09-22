const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User, File } = require("../models/models");
const fileService = require("../services/createDir");
const sequelize = require("../dbConection");

class AuthController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const transaction = await sequelize.transaction();

      const candidate = await User.findOne({ where: { email } });

      if (candidate) {
        await transaction.rollback();
        return res
          .status(409)
          .json({ message: "User with such email already exists" });
      }

      const salt = bcrypt.genSaltSync(5);

      const hashPassword = bcrypt.hashSync(password, salt);

      if (!hashPassword) {
        await transaction.rollback();
        return res.json({
          message: "Error creation an new user, please try again!",
        });
      }

      const user = await User.create({ email, password: hashPassword });
      const file = await File.create({
        name: user.id,
        type: "dir",
        userId: user.id,
        parentId: -1,
      });

      const isFileCreationSuccess = fileService.createDir(file);

      if (!isFileCreationSuccess) {
        await transaction.rollback();
        return res.json({
          message: "Error creation a new user, please try again!",
        });
      }

      await transaction.commit();

      const token = jsonwebtoken.sign(
        {
          userId: user.id,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          email: user.email,
        },
        process.env.JSONWEBTOKEN_SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res.json({ token });
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const candidate = await User.findOne({ where: { email } });

      if (!candidate) {
        return res.status(404).json({
          message: "A user with this email address was not found.",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        candidate.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Incorrect password has been entered. Please try again.",
        });
      }

      const token = await jsonwebtoken.sign(
        {
          userId: candidate.id,
          diskSpace: candidate.diskSpace,
          usedSpace: candidate.usedSpace,
          email: candidate.email,
        },
        process.env.JSONWEBTOKEN_SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res.json({ token });
    } catch (error) {
      console.log(error);
    }
  }

  async auth(req, res) {
    const token = jsonwebtoken.sign(
      {
        userId: req.user.userId,
        diskSpace: req.user.diskSpace,
        usedSpace: req.user.usedSpace,
        email: req.user.email,
      },
      process.env.JSONWEBTOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    console.log(token);

    return res.json({ token });
  }
}

module.exports = new AuthController();
