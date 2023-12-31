"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let BusinessSchema = new Schema(
	{
		name: {
			type: String,
		},
		city: {
			type: String,
		},
		icon: {
			type: String,
		},
		images: {
			type: JSON,
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
	Model: mongoose.model("Business", BusinessSchema),
};
