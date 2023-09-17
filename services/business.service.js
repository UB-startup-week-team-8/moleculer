"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

require("dotenv").config();
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const { Model } = require("../models/business.model");
const { ObjectId } = require("mongodb");

/** @type {ServiceSchema} */
module.exports = {
	name: "business",

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
				name: "string",
				icon: "string",
				city: "string",
				images: { type: "array", items: "string", optional: true },
				description: "string",
			},
			async handler(ctx) {
				const entity = ctx.params;
				return this.adapter
					.insert(entity)
					.then((doc) => this.transformDocuments(ctx, {}, doc));
			},
		},

		batchGet: {
			rest: {
				method: "GET",
				path: "/batch",
			},
			params: {
				biz_ids: {
					type: "string",
				},
			},
			async handler(ctx) {
				if (ctx.params.biz_ids.length == 0) {
					return [];
				}

				const res = await this.adapter
					.find({
						query: {
							_id: { $in: ctx.params.biz_ids.split(",") },
						},
					})
					.then((docs) => this.transformDocuments(ctx, {}, docs));

				return res;
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
