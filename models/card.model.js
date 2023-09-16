"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CardSchema = new Schema(
	{
		position: {
			type: String,
		},
		city: {
			type: String,
		},
		biz_id: {
			type: String,
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = {
	Model: mongoose.model("Card", CardSchema),
};
