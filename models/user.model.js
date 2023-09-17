"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
		},
		first_name: {
			type: String,
		},
		last_name: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = {
	Model: mongoose.model("User", UserSchema),
};
