const GetQuizPrice = async (pack) => {
    const level = await pack.level;
    const category = await pack.category;

    if(level === 'easy' || level === "medium") {
        return category === "Technical Analysis" ? .015 : .3
    } else {
        return category === "Technical Analysis" ? .2 : .6
    }
}

export default GetQuizPrice;