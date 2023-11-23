const reviewDatabase = require('../database/review.js');
module.exports.getDataByID = async (req, res) => {
    console.log(req.params.id);
    const data = await reviewDatabase.getDataByID(req.params.id);
    res.send(data);
}
