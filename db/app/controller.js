const { selectTopics, selectEndpoints } = require("./model")

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints: endpoints})
    })
    .catch(next)
}

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics: topics})
    })
    .catch(next)
}