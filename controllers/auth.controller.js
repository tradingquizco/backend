import Account from "../models/account.model.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { SendRes } from "../util/helpers/index.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  // const { email, password } = req.body;

  if (!email || !password) {
    return SendRes(res, 400, { message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return SendRes(res, 401, { message: "Incorrect email or passwrod" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return SendRes(res, 401, { message: "Incorrect email or passwrod" });
    }

    // Assume each user has at least one account
    const account = await Account.findAll({ where: { userId: user.id } });

    // Create a session for the user (Assuming you have session handling set up)
    const [session, isSessionCreated] = await Session.findOrCreate({
      where: { userId: user.id, currentAccountId: account[0].id },
      defaults: {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        sessionData: JSON.stringify({ email: user.email }),
      },
    });

    console.log(session.dataValues.sessionData);
    if (isSessionCreated) {
      session.expires = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    }

    const sessionData = JSON.parse(session.dataValues.sessionData);
    SendRes(res, 200, {
      url: `/dashboard/${account[0].role}`,
      session: JSON.stringify({
        email: sessionData.email,
        // name: user./
        currentAccountId: session.dataValues.currentAccountId,
        expires: session.dataValues.expires
      }),
    });
  } catch (err) {
    console.error(err);
    SendRes(res, 500, { message: "Server error", error: err });
  }
};

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password || !name) {
    SendRes(res, 409, { message: "All fields required" });
  }

  // SendRes(res, 500, "sdfsf")
  try {
    const isUsernameTaken = await Account.findOne({ where: { username } });
    if (isUsernameTaken)
      return SendRes(res, 409, { message: "username already exists." });

    const [user, isUserCreated] = await User.findOrCreate({
      where: { email },
      defaults: {
        username,
        password,
        name,
        status: "online",
      },
    });

    if (!isUserCreated) {
      return SendRes(res, 409, { message: "User already exists." });
    }

    const [account, isAccountCreated] = await Account.findOrCreate({
      where: { userId: user.id, username },
      defaults: { role: "user", profile: "" },
    });

    SendRes(res, 200, { message: "Registration successful" });
  } catch (err) {
    SendRes(res, 500, err);
  }
};
