const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coffeelogSchema = new Schema(
  {
    roasters: { type: String, required: true },
    blend: { type: String, required: true },
    method: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    grindsize: String,
    beanorigin: String,
    roastlevel: String,
    brewlocation: String,
    coffeedose: { type: Number, min: 0 },
    watervolume: { type: Number, min: 0 },
    watertemp: { type: Number, min: 0 },
    flavors: [{ type: String }],
    comments: [{ type: String }],
    img: { type: String },
    owner_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Coffeelog = mongoose.model("Coffeelog", coffeelogSchema);

module.exports = Coffeelog;
