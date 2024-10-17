const GetPackPrice = async (pack) => {
    const level = await pack.level;
    const quizzes = await pack.getQuizzes();
    const quizNumber = quizzes.length;
    const category = await pack.category;

    if(level === "easy" || level === "medium") {
        return category === "Technical Analysis" ? quizNumber * 0.015 : quizNumber * .3
    } else {
        return category === "Technical Analysis" ? quizNumber * 0.2 : quizNumber * .6
    }
}

export default GetPackPrice