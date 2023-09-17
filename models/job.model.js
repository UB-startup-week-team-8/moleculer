"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let JobSchema = new Schema(
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
		info: {
			type: String,
		},
		industry: {
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
	Model: mongoose.model("Job", JobSchema),
};
