import Account from "../models/account.model.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import createHash from "../util/helpers/createHash.js";
import { SendRes } from "../util/helpers/index.js";
import bcrypt from "bcryptjs";
import requestIp from "request-ip";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const userAgent = req.headers["sec-ch-ua"] || req.headers["user-agent"];
  const isMobile = req.headers["sec-ch-ua-mobile"] === "?1";
  const platform = req.headers["sec-ch-ua-platform"] || "Unknown";
  const clientIp = requestIp.getClientIp(req);
  const ipv4Address = clientIp.includes("::ffff:")
    ? clientIp.split("::ffff:")[1]
    : clientIp;

  if (!email || !password) {
    return SendRes(res, 400, { message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return SendRes(res, 401, { message: "Incorrect email or passwrod" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return SendRes(res, 401, { message: "Incorrect email or passwrod" });
    }

    const account = await Account.findAll({ where: { userId: user.id } });
    if (!account) return SendRes(res, 404, { message: "Account Not Found" });

    const expiration_at_15_days = Date.now() + 15 * 24 * 60 * 60 * 1000;
    const [session, isSessionCreated] = await Session.findOrCreate({
      where: {
        userId: user.id,
        accountId: account[0].id,
        platform: platform,
        mobile: isMobile,
        ipAddress: ipv4Address,
        userAgent,
      },
      defaults: {
        sessionToken: JSON.stringify({
          email: user.email,
          name: user.name,
          account: account[0],
        }),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    });

    if (isSessionCreated) {
      console.log("updating");
      await session.update({
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      });
    }

    const responseBody = {
      sessionToken: session.sessionToken,
      sessionId: session.id,
      cookieConfig: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_DOMAIN.toString(),
        path: "/",
        sameSite: "lax",
        maxAge: session.expiresAt,
      },
      url:
        account[0].role === "quizer"
          ? process.env.QUIZER_URL
          : account[0].role === "user"
          ? process.env.USER_URL
          : process.env.ADMIN_URL,
    };

    SendRes(res, 200, responseBody);
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

export const sessionValidation = async (req, res) => {
  const { sessionId, sessionToken, role } = req.body;

  if (!sessionId || !sessionToken || !role) {
    return SendRes(res, 409, { message: "All Fields required!" });
  }

  try {
    const session = await Session.findByPk(sessionId, {
      include: { model: Account, attributes: ["role"] },
    });

    const sessionTokenMatch = sessionToken === session.sessionToken;
    if (!sessionTokenMatch) {
      return SendRes(res, 404, { message: "Invalid session token" });
    }

    const sessionAccount = session.account;
    if (sessionAccount.role !== role) {
      return SendRes(res, 400, {message: "Role Does Not Match"})
    }

    SendRes(res, 200, {isValid: true})
  } catch (err) {
    console.log(err);
    SendRes(res, 500, { message: "Server error" });
  }
};
