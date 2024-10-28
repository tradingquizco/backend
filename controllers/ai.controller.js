import { SendRes } from "../util/helpers/index.js";

export const chatToAi = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return SendRes(res, 409, { message: "Content Required!" });
  }

  try {
    const body = JSON.stringify({
      botId: process.env.BOT_ID.toString(),
      user: {
        name: "",
        id: "",
      },
      initialMessages: [
        {
          type: "USER",
          content: null,
        },
      ],
    });
    const ai_res = await fetch(process.env.METIS_API.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.METIS_API_KEY.toString()}`,
        "Content-Type": "application/json",
      },
      body,
    });
    console.log(ai_res);

    SendRes(res, 200, await ai_res.json());
    // const {messages} = await ai_res.json();
    // const answer_res = await fetch(
    //   `${process.env.METIS_API.toString()}s/${messages[0].id.toString()}/message`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${process.env.METIS_API_KEY.toString()}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       type: "USER",
    //       content,
    //     }),
    //   }
    // );

    // SendRes(res, 200, await answer_res.json());
  } catch (err) {
    console.log(err);
    SendRes(res, 500, { message: "Internal server error" });
  }
};
