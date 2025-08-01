// import { User } from "../../models/index.js";
// import { generateToken } from "../../security/jwt-util.js";

// const login = async (req, res) => {
//   try {
//     //fetching all the data from users table
//     if (req.body.email == null) {
//       return res.status(500).send({ message: "email is required" });
//     }
//     if (req.body.password == null) {
//       return res.status(500).send({ message: "email is required" });
//     }
//     const user = await User.findOne({ where: { email: req.body.email } });
//     if (!user) {
//       return res.status(500).send({ message: "user not found" });
//     }
//     if (user.password == req.body.password) {
//       const token = generateToken({ user: user.toJSON() });
//       return res.status(200).send({
//         data: { access_token: token, user: user.toJSON() },
//         message: "successfully logged in",
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: "Failed to login" });
//   }
// };

// /**
//  *  init
//  */

// const init = async (req, res) => {
//   try {
//     const user = req.user.user;
//     delete user.password;
//     res
//       .status(201)
//       .send({ data: user, message: "successfully fetched current  user" });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };

// export const authController = {
//   login,
//   init,
// };



import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!password) return res.status(400).send({ message: "Password is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send({ message: "User not found" });

    if (user.password !== password) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Convert Sequelize model instance to plain object and exclude password
    const userData = user.toJSON();
    delete userData.password;

    // Generate JWT token with safe user data
    const token = generateToken({ user: userData });

    return res.status(200).send({
      data: {
        access_token: token,
        user: userData, // Contains isAdmin if defined in your model
      },
      message: "Successfully logged in",
    });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).send({ error: "Failed to login" });
  }
};

const init = async (req, res) => {
  try {
    const user = req.user?.user;

    if (!user) return res.status(401).send({ message: "Not authenticated" });

    return res.status(200).send({
      data: user,
      message: "Fetched current user",
    });
  } catch (e) {
    console.error("Init Error:", e);
    res.status(500).send({ error: "Failed to fetch user" });
  }
};

export const authController = {
  login,
  init,
};
