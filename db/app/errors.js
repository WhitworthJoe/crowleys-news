exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        return res.status(400).send({ msg: "Bad request" });
    } else if (err.code === '23503') {
        return res.status(400).send({msg: 'id does not exist'})
    } else if (err.code === '23502') {
        return res.status(400).send({msg: 'missing required information'})
    } else next(err)
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).send({msg: err.msg})
    } else next(err)
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" })
}