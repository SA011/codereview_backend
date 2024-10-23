const { get } = require('../routes/review.js');
const {getConnection, release} = require('./connect.js');

const getDataByIDCommand = "SELECT * FROM review_data WHERE data_id = $1";
const getDataBylangCommand = "SELECT data_id FROM review_data WHERE lang = $1::text";
const getDataBylangCommandCount1 = "SELECT data_id FROM review_data WHERE lang = $1::text AND (SELECT COUNT(*) FROM review_comments WHERE data_id = review_data.data_id) = 1";
const countReviewCommand = "SELECT COUNT(*) FROM review_comments WHERE data_id = $1";

const addReviewCommentCommand = "INSERT INTO review_comments(data_id, comment, name, organization) VALUES($1, $2, $3, $4)";
const addReviewScoreCommand = "INSERT INTO review_ratings(data_id, model, information, relevance, explanation_clarity, name, organization) VALUES($1, $2, $3, $4, $5, $6, $7)";
module.exports.getDataByID = async (data_id) => {
    // console.log(data_id);
    const pool = await getConnection();
    const res = (await pool.query(getDataByIDCommand, [data_id])).rows;
    // console.log(res);
    release(pool);
    if(res.length != 1)return null;
    return res[0];
}
function randomShuffle(array){
    for(let i = 0; i < array.length; i++){
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}

async function selectData(data){
    data = randomShuffle(data);
    for(let i = 0; i < data.length; i++){
        id = data[i].data_id;   
        const pool = await getConnection();
        const res = (await pool.query(countReviewCommand, [id]).then(results => {
            release(pool)
            return results;
          })).rows;
        
        // console.log(res);
        if(res.length != 1)continue;
        if(res[0].count < 4){
            // console.log(id);
            return id;
        }
    }
    return null;
}

// module.exports.getDataBylang = async (lang) => {
//     const pool = await getConnection();
//     // console.log(lang);
//     const res = (await pool.query(getDataBylangCommand, [lang]).then(results => {
//         // console.log(results);
//         release(pool);
//         return results;
//     })).rows;
//     // console.log(res);
//     id = await selectData(res).then(data_id => {
//         // console.log(data_id);
//         return data_id;
//     });
//     ret = await this.getDataByID(id).then(data => {
//         return data;
//     });
//     return ret;
// };


module.exports.getDataBylang = async (lang) => {
    const pool = await getConnection();
    // console.log(lang);
    const resCount1 = (await pool.query(getDataBylangCommandCount1, [lang]).then(results => {
        // console.log(results);
        release(pool);
        return results;
    })).rows;
    // console.log(resCount1);
    if (resCount1.length >= 20){
        id = await selectData(resCount1).then(data_id => {
            // console.log(data_id);
            return data_id;
        });
        ret = await this.getDataByID(id).then(data => {
            return data;
        });
        return ret;
    }
    else{
        const pool = await getConnection();
        const res = (await pool.query(getDataBylangCommand, [lang]).then(results => {
            // console.log(results);
            release(pool);
            return results;
        })).rows;
        // console.log(res);
        id = await selectData(res).then(data_id => {
            // console.log(data_id);
            return data_id;
        });
        ret = await this.getDataByID(id).then(data => {
            return data;
        });
        return ret;
    }
};

module.exports.addReviewComment = async (data_id, model, information, relevance, explanation_clarity, comment, name, organization) => {
    const pool = await getConnection();
    const res = (await pool.query(addReviewCommentCommand, [data_id, comment, name, organization]).then(results => {
        release(pool);
        return results;
    })).rows;
    // console.log(information);
    // console.log(relevance);
    // console.log(explanation_clarity);
    const number_of_model = model.length;
    for(let i = 0; i < number_of_model; i++){
        const pool = await getConnection();
        const res = (await pool.query(addReviewScoreCommand, [data_id, model[i], information[i], relevance[i], explanation_clarity[i], name, organization]).then(results => {
            release(pool);
            return results;
        })).rows;
    }


    // console.log(res);
    return res;
}
