import Account from "../models/account.model.js";
import Pack from "../models/pack.model.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { SendRes } from "../util/helpers/index.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !image) {
    SendRes(res, 400, { message: "All Feilds are required" });
    return;
  }

  try {
    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: { name, password },
    });
    SendRes(res, 200, user);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.findAll();
    SendRes(res, 200, allUsers);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    user
      ? SendRes(res, 200, user)
      : SendRes(res, 404, { message: "User not found" });
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ where: { email } });
    user
      ? SendRes(res, 200, user)
      : SendRes(res, 404, { message: "User not found" });
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const getUserByAccount = async (req, res) => {
  const { accountId } = req.params;

  if (!accountId) {
    SendRes(res, 409, { message: "All fields required" });
    return;
  }

  try {
    const account = await Account.findByPk(accountId);
    if (account) {
      const user = await account.getUser();
      if (user) SendRes(res, 200, user);
      return;
    }
    SendRes(res, 200, null);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const updatedUser = req.body;
  const { id } = req.params;

  try {
    const exsiting = await User.findOne({ where: { id } });
    if (!exsiting) return SendRes(res, 404, { message: "User not found" });

    await User.update(updatedUser, { where: { id } });
    const editedUser = await User.findOne({ where: { id } });
    SendRes(res, 200, editedUser);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    SendRes(res, 200, { message: "User successfully deleted" });
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const addPackToUserPacks = async (req, res) => {
  const { packId, sessionId } = req.body;

  console.log(req.body);

  if (!packId || !sessionId)
    return SendRes(res, 409, { message: "All Feilds are required" });

  try {
    const session = await Session.findByPk(sessionId, {
      include: { model: Account },
    });
    const account = session.addHook;
    if (!account) return SendRes(res, 404, { message: "Account not found" });

    const pack = await Pack.findByPk(packId);
    if (!pack) return SendRes(res, 404, { message: "Pack not found" });

    pack.addAccount(account);
    SendRes(res, 200, { message: "Pack Added" });
  } catch (err) {
    console.log(err);
    SendRes(res, 500, { message: "Internal server error" });
  }
};
