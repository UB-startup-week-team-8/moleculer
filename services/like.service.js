"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

require("dotenv").config();
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const { Model } = require("../models/like.model");

/** @type {ServiceSchema} */
module.exports = {
	name: "like",

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
		userLike: {
			rest: {
				method: "POST",
				path: "/user",
			},
			params: {
				user_id: "string",
				card_id: "string",
				liked: "boolean",
			},
			async handler(ctx) {
				return this.adapter
					.insert(ctx.params)
					.then((doc) => this.transformDocuments(ctx, {}, doc));
			},
		},

		getUserCardsLiked: {
			rest: {
				method: "GET",
				path: "/user/cards",
			},
			params: {
				user_id: "string",
				card_ids: "string",
			},
			async handler(ctx) {
				return this.adapter.find({
					query: {
						user_id: ctx.params.user_id,
						card_id: {
							$in: ctx.params.card_id.split(","),
						},
					},
					sort: ["-createdAt"],
				});
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
