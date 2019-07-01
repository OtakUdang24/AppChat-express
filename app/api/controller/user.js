// const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwtDecode = require('jwt-decode');
const config = require("../../../config");
var moment = require('moment');
const db = config.db;

module.exports = {
  testing: function(req, res, next) {
    res.send("testing at user");
  },
  login: function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    db.query(
      `SELECT * FROM users WHERE email = "${email}" AND password = "${password}"`,
      function(err, rows, fields) {
        if(err){
          res.send({success: false, message: err, })
        }else if(rows.length > 0 ){
          const user = {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email
          }
          const token = jwt.sign({email: email}, config.secret)
          res.status(200).send({success: true, message: "success", token, user})
        }else{
          res.send({success: false, message: "error", })
        }
      }
    );
  },
  getMessages: function(req, res, next) {
    db.query(
      `SELECT groupchat.id AS id_message,users.email,users.name,groupchat.id_user, groupchat.message, groupchat.created_at, updated_at FROM groupchat INNER JOIN users ON users.id = groupchat.id_user ORDER BY groupchat.id ASC`,
      function(err, rows, fields) {
        if(err){
          res.send({success: false, message: err, })
        }else if(rows.length > 0 ){
          res.status(200).send({success: true, message: "success", rows})
        }else{
          res.send({success: false, message: "error", })
        }
      }
    );
  },
  insertMessage: function(req, res, next) {
    const token = req.headers.authorization;
    const decoded = jwtDecode(token);
    const message = req.body.message;
    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");
    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

    db.query(`SELECT users.id,users.email FROM users WHERE email = "${decoded.email}"`, function(err, rows, field) {
      if (err) res.send(err);
      let id = rows[0].id;
      db.query(`INSERT INTO groupchat(id_user, message, created_at, updated_at) VALUES(${id}, "${message}", "${created_at}", "${updated_at}")`, function(err, rows, field) {
        if (err) res.send(err);
        res.status(200).send({success: true, message: "success",})
      });
    });
  },
  getUser: function(req, res) {
    const token = req.headers.authorization;
    const decoded = jwtDecode(token);
    db.query(`SELECT users.id,users.email FROM users WHERE email = "${decoded.email}"`, function(err, rows, field) {
      if (err) res.send(err);
      let id = rows[0].id;
      res.status(200).send({success: true, message: "success", idUser: id})
    });
  },
  deleteMessage: function(req, res){
    const id_message = req.params.id
    db.query(`DELETE FROM groupchat WHERE id = ${id_message}`, function(err, rows, field) {
      if (err) res.send(err);

      res.status(200).send({success: true, message: "success"})
    });
  },
  updateMessage: function(req, res){
    const id_message = req.params.id
    const messageEdited = req.body.message

    db.query(`UPDATE groupchat SET message = "${messageEdited}" WHERE id = ${id_message}`, function(err, rows, field) {
      if (err) res.send(err);

      res.status(200).send({success: true, message: "success"})
    });
  }
};
