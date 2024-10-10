import Account from "../models/account.model.js";
import User from "../models/user.model.js";
import { SendRes } from "../util/helpers/index.js";

export const createAccount = async (req, res) => {
  const { provider, providerAccountId, userId, ...account } = req.body;

  if (!provider || !providerAccountId || !userId) {
    SendRes(res, 409, { message: "All fields required" });
    return;
  }

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return SendRes(res, 404, { message: "User not found" });

    const [account, created] = await Account.findOrCreate({
      where: { provider, providerAccountId, userId },
      defaults: {},
    });
    SendRes(res, 200, account);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const DeleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    await Account.destroy({ where: { id } });
    SendRes(res, 200, { message: "Account successfully deleted" });
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const IsAccountValid = async (req, res) => {
  const { accountId, email, role } = req.body;

  if (!accountId || !email || !role) {
    return SendRes(res, 409, { message: "All fields required" });
  }

  try {
    const account = await Account.findOne({ where: { id: accountId, role } });
    if (!account) return SendRes(res, 404, { isValid: false });

    const user = await account.getUser();
    if (user.email !== email) return SendRes(res, 404, { isValid: false });

    SendRes(res, 200, { isValid: true });
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const getUserAccounts = async (req, res) => {
  const {id} = req.params;

  try {
    const accounts = await Account.findAll({where: {userId: id}});
    SendRes(res, 200, accounts)
  } catch(err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
}