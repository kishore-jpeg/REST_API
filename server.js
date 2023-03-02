const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


const config = {
  autoIndex: false,
  useNewUrlParser: true,
};
// mongodb://localhost:27017/bankData
mongoose.connect(process.env.MONGO_ATLAS_PW, config, mongoose.set('strictQuery', true))
const bankSchema = {
  ifsc: String,
  bank_id: Number,
  branch: String,
  address: String,
  city: String,
  district: String,
  state: String,
  bank_name: String
}

const Bank = mongoose.model("Bank", bankSchema)

app.get('/', (req, res) => {

  Bank.distinct("bank_name", function (err, allBanks) {
    if (!err) {
      res.send(allBanks)
    } else {
      res.send(err)
    }
  })
});

app.route("/:bankBranch")
  .get(function (req, res) {
    Bank.findOne({
      branch: (req.params.bankBranch).toUpperCase()
    }, {
      _id: 0,
      bank_id: 0
    }, function (err, singleBank) {
      if (singleBank) {
        res.send(singleBank)
      } else {
        res.send("NO Bank branch with that name. Try again!")
      }
    })
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});