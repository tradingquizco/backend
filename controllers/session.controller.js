import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { SendRes } from "../util/helpers/index.js";

export const createSession = async (req, res) => {
  const { sessionToken, expires, userId } = req.body;

  if (!sessionToken || !expires || !userId) {
    SendRes(res, 409, { message: "All fields required" });
    return;
  }

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return SendRes(res, 404, { message: "User not found" });

    const [session, created] = await Session.findOrCreate({
      where: { sessionToken, userId },
      defaults: { expires },
    });
    SendRes(res, 200, session);
  } catch (err) {
    SendRes(res, 500, { message: err });
  }
};

export const getSessionBySessionToken = async (req, res) => {
  const { sessionToken } = req.params;

  try {
    const session = await Session.findOne({ where: { sessionToken } });
    SendRes(res, 200, session);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const updatedSessionBySessionToken = async (req, res) => {
  const { sessionToken } = req.params;
  const session = req.body;

  try {
    const existing = await Session.findOne({where: {sessionToken}});
    if(!existing) return SendRes(res, 404, {message: "session not found"});

    await Session.update(session, {where: {sessionToken}});
    const editedSession = await Session.findOne({where: {id: existing.id}});
    SendRes(res, 200, editedSession);
  } catch (err) {
    SendRes(res, 500, {message: "Internal server error"});
  }
};

export const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    await Session.destroy({where: {id}});
    SendRes(res, 200, {message: "Session successfully deleted"});
  } catch(err) {
    SendRes(res, 500, {message: "Internal server error"})
  }
}
