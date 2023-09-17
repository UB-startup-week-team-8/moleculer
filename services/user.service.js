"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

require("dotenv").config();
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const { Model } = require("../models/user.model");

/** @type {ServiceSchema} */
module.exports = {
	name: "user",

	mixins: [DbService],

	adapter: new MongooseAdapter(process.env.MONGO_URI),

	model: Model,

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		create: {
			rest: {
				method: "POST",
				path: "/",
			},
			params: {
				first_name: "string",
				last_name: "string",
				email: "email",
			},
			async handler(ctx) {
				return this.adapter
					.insert(ctx.params)
					.then((doc) => this.transformDocuments(ctx, {}, doc));
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
