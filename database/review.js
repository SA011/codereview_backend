const {getConnection, release} = require('./connect.js');

const getDataByIDCommand = "SELECT * FROM review_data WHERE data_id = $1";
const getDataBylangCommand = "SELECT data_id FROM review_data WHERE lang = $1::text";
const countReviewCommand = "SELECT COUNT(*) FROM review_comments WHERE data_id = $1";
const addReviewCommentCommand = "INSERT INTO review_comments(data_id, rating_information, rating_relevance, comment, name, organization) VALUES($1, $2, $3, $4, $5, $6)";
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
        if(res[0].count < 2){
            // console.log(id);
            return id;
        }
    }
    return null;
}


module.exports.getDataBylang = async (lang) => {
    const pool = await getConnection();
    console.log(lang);
    const res = (await pool.query(getDataBylangCommand, [lang]).then(results => {
        console.log(results);
        release(pool);
        return results;
    })).rows;
    console.log(res);
    id = await selectData(res).then(data_id => {
        console.log(data_id);
        return data_id;
    });
    ret = await this.getDataByID(id).then(data => {
        return data;
    });
    return ret;
}


module.exports.addReviewComment = async (data_id, rating_information, rating_relevance, comment, name, organization) => {
    const pool = await getConnection();
    const res = (await pool.query(addReviewCommentCommand, [data_id, rating_information, rating_relevance, comment, name, organization]).then(results => {
        release(pool);
        return results;
    })).rows;
    
    // console.log(res);
    return res;
}
