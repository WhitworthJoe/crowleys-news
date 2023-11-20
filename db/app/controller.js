const { selectTopics, selectEndpoints } = require("./model")

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((rows) => {
        res.status(200).send({endpoints: rows})
    })
    .catch(next)
}

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((rows) => {
        res.status(200).send({topics: rows})
    })
    .catch(next)
}