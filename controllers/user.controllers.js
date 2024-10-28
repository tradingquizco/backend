import Account from "../models/account.model.js";
import InviteModel from "../models/Invites.model.js";
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

  if (!packId || !sessionId)
    return SendRes(res, 409, { message: "All fields are required" });

  try {
    const session = await Session.findByPk(sessionId, {
      include: { model: Account },
    });
    if (!session || !session.account)
      return SendRes(res, 404, { message: "Account not found" });

    const account = session.account;
    const pack = await Pack.findByPk(packId);
    if (!pack) return SendRes(res, 404, { message: "Pack not found" });

    // Using the association method addAccount to add the pack to the user's packs
    await pack.addAccount(account);

    SendRes(res, 200, { message: "Pack Added" });
  } catch (err) {
    console.log(err);
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const inviteUser = async (req, res) => {
  const { sessionId, inviterCode } = req.body;

  if (!sessionId || !inviterCode)
    return SendRes(res, 409, { message: "All Fields required" });

  try {
    const session = await Session.findByPk(sessionId, {
      include: { model: User },
    });

    if (!session) return SendRes(res, 404, { message: "Session Not Found" });

    const inviter_user = await User.findOne({
      where: { invite_code: inviterCode },
    });
    const invited_user = session.user;

    if (!inviter_user || !invited_user) {
      return SendRes(res, 404, { message: "User Not Found" });
    }

    await InviteModel.create({
      inviter: inviter_user.id,
      invited: invited_user.id,
    });

    SendRes(res, 200, { message: "User Invited!" });
  } catch (err) {
    console.error("Error creating invite:", err);
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const numberOfInvites = async (req, res) => {
  const { sessionId } = req.params;
  console.log(sessionId)

  if (!sessionId) return SendRes(res, 409, { message: "All Feilds Required" });

  try {
    const session = await Session.findByPk(sessionId, {
      include: { model: User },
    });
    const user = session.user;

    if (!user) return SendRes(res, 404, { message: "User Not Found" });

    const numberOfInvites = await InviteModel.findAll({ inviter: user.id });
    SendRes(res, 200, numberOfInvites.length);
  } catch (err) {
    console.log(err);
    SendRes(res, 500, { message: "Internal server error" });
  }
};
