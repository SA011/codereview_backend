const {getConnection, release} = require('./connect.js');

const getDataByIDCommand = "SELECT * FROM review_data WHERE data_id = $1";

module.exports.getDataByID = async (data_id) => {
    console.log(data_id);
    const pool = await getConnection();
    const res = (await pool.query(getDataByIDCommand, [data_id])).rows;
    // console.log(res);
    release(pool);
    if(res.length != 1)return null;
    return res[0];
}