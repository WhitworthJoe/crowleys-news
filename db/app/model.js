const db = require("../../../be-mitchs-rare-treasures/db")

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then((data) => {
        return data.rows
    })
}