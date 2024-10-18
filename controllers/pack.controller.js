import { where } from "sequelize";
import Account from "../models/account.model.js";
import Pack from "../models/pack.model.js";
import Quiz from "../models/quiz.model.js";
import { SendRes } from "../util/helpers/index.js";
import CoverPack from "../models/images/coverPack.model.js";
import GetQuizPrice from "../util/helpers/getQuizPrice.js";
import GetPackPrice from "../util/helpers/getPackPrice.js";

export const createPack = async (req, res) => {
  const { title, description, level, isFree, category, creatorId } = req.body;

  // Check for required fields
  if (!title || !description || !creatorId || !level || !isFree || !category) {
    SendRes(res, 409, { message: "All fields required" });
    return;
  }
  try {
    // Check if the account exists
    const account = await Account.findOne({ where: { id: creatorId } });
    if (!account) {
      return SendRes(res, 404, { message: "Account Not Found" });
    }

    // Create the pack
    const pack = await Pack.create({
      title,
      isFree,
      level,
      description,
      category,
      price: Number(0),
      creatorId: Number(creatorId),
      coverImageUrl: "",
    });

    const packCover = await CoverPack.create({
      url: req.file.filename,
      packId: pack.id,
    });
    const updatedPack = await pack.update(
      { coverImageUrl: packCover.url },
      {
        returning: true,
      }
    );
    return SendRes(res, 200, updatedPack);
  } catch (err) {
    console.error("Error creating pack:", err);
    return SendRes(res, 500, {
      message: "Internal server error",
      error: err.message,
    });
  }
};
export const getAllPacks = async (req, res) => {
  try {
    const packs = await Pack.findAll({
      include: { model: Account, attributes: ["username"] },
    });

    const formattedPacks = await Promise.all(
      packs.map(async (pack) => {
        const quizzes = await pack.getQuizzes();

        return {
          id: pack.dataValues.id,
          title: pack.dataValues.title,
          description: pack.description,
          quizNumber: quizzes.length,
          username: pack.dataValues.account.dataValues.username,
          coverImageUrl: pack.coverImageUrl,
          category: pack.category,
          level: pack.level,
          price: pack.price,
          isFree: pack.isFree,
        };
      })
    );

    SendRes(res, 200, formattedPacks);
  } catch (err) {
    console.log(err);
    return SendRes(res, 500, { message: "Internal server error" });
  }
};

export const updatePack = async (req, res) => {
  const updatedItems = req.body;
  const { packId } = req.params;

  let updatePrice = undefined;
  console.log(updatedItems);

  if (JSON.stringify(updatedItems) === "{}" && !req.file) {
    SendRes(res, 400, { message: "You Should Change At Lease One Property" });
    return;
  }
  try {
    const pack = await Pack.findOne({ where: { id: packId } });

    const updatedPack = await pack.update(
      {
        ...updatedItems,
        coverImageUrl: req.file ? req.file.path : pack.dataValues.coverImageUrl,
      },
      {
        returning: true,
      }
    );

    if (updatedItems.level || updatedItems.category || updatedItems.isFree) {
      if (!updatePack.isFree) {
        const newPackPrice = await GetPackPrice(pack);
        updatePrice = Number(newPackPrice);

        await pack.update({ price: updatePrice ?? pack.price });
      }
    }
    SendRes(res, 200, updatedPack);
  } catch (err) {
    return SendRes(res, 500, { message: "Internal server error" });
  }
};

export const getAccountPacks = async (req, res) => {
  const { accountId } = req.params;
  if (!accountId) {
    SendRes(res, 404, { message: "All fields required" });
    return;
  }

  try {
    const accountPacks = await Pack.findAll({
      where: { creatorId: accountId },
      include: { model: Account, attributes: ["username"] },
    });

    const packs = await Promise.all(
      accountPacks.map(async (pack) => {
        const quizzes = await pack.getQuizzes();
        return {
          ...pack.dataValues,
          quizNumber: quizzes.length,
          username: pack.dataValues.account.dataValues.username,
        };
      })
    );

    SendRes(res, 200, packs);
  } catch (err) {
    return SendRes(res, 500, { message: "Internal server error" });
  }
};

export const addQuizToPack = async (req, res) => {
  const { packId, quizId } = req.body;

  try {
    const pack = await Pack.findByPk(packId);
    const quiz = await Quiz.findOne({ where: { id: quizId } });

    if (!pack) return SendRes(res, 404, { message: "Pack Not Found" });
    if (!Quiz) return SendRes(res, 404, { message: "Quiz Not Found" });

    if (pack && quizId) {
      pack.addQuiz(quiz);
      const quizPrice = await GetQuizPrice(pack);

      //update price
      await pack.update({ price: Number(pack.price + quizPrice) });
      SendRes(res, 200, { message: "quiz added to pack" });
    }
  } catch (err) {
    return SendRes(res, 500, { message: "Internal server error" });
  }
};
