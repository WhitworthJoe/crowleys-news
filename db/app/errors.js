exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad request" });
  } else if (err.constraint === "comments_author_fkey") {
    return res.status(404).send({ msg: "username does not exist"})
  } else if (err.constraint === "comments_article_id_fkey") {
    return res.status(400).send({ msg: "article does not exist"})
  } else if (err.constraint === "articles_topic_fkey") {
    return res.status(404).send({msg: "topic does not exist"})
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
