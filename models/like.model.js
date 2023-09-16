"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let LikeSchema = new Schema(
	{
		user_id: {
			type: String,
		},
		card_id: {
			type: String,
		},
		liked: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = {
	Model: mongoose.model("Like", LikeSchema),
};
