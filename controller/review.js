const reviewDatabase = require('../database/review.js');

module.exports.getDataByID = async (req, res) => {
    // console.log(req.params.id);
    const data = await reviewDatabase.getDataByID(req.params.id);
    res.send(data);
}

langlist = ['c', 'cpp', '.cs', 'go', 'java', 'js', 'py', 'rb', 'php'];

module.exports.getDataByLang = async (req, res) => {
    // lang = req.body.lang;
    lang = req.params.lang;
    // console.log(lang);
    if(lang == undefined || langlist.indexOf(lang) == -1){
        res.sendStatus(404);
    }else{
        const ret = await reviewDatabase.getDataBylang(lang);
        // res.send(await reviewDatabase.getDataBylang(lang));
        // console.log(ret);
        res.send(ret);
    }
}

module.exports.addReviewComment = async (req, res) => {
    // console.log(req.body);
    const data = await reviewDatabase.addReviewComment(req.body.data_id, req.body.rating_information, req.body.rating_relevance, req.body.comment, req.body.name, req.body.organization);
    res.sendStatus(200);
}