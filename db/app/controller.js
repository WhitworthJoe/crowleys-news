const { selectTopics } = require("./model")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((rows) => {
        res.status(200).send({topics: rows})
    })
    .catch(next)
}