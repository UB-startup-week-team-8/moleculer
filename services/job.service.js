"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

require("dotenv").config();
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const { Model } = require("../models/job.model");

/** @type {ServiceSchema} */
module.exports = {
	name: "job",

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
				position: "string",
				city: "string",
				biz_id: "string",
				description: "string",
				industry: "string",
				info: "string",
			},
			async handler(ctx) {
				const entity = ctx.params;
				return this.adapter
					.insert(entity)
					.then((doc) => this.transformDocuments(ctx, {}, doc));
			},
		},
		list: false,
		listJobs: {
			rest: {
				method: "GET",
				path: "/",
			},
			params: {
				user_id: { type: "string" },
				city: { type: "string", optional: true },
				industry: { type: "string", optional: true },
				limit: {
					type: "number",
					convert: true,
					min: 1,
					optional: true,
					default: 100,
					positive: true,
				},
				offset: {
					type: "number",
					convert: true,
					min: 0,
					optional: true,
					default: 0,
				},
			},
			async handler(ctx) {
				let query = {};
				if (ctx.params.city && ctx.params.city.length > 0) {
					query["city"] = ctx.params.city;
				}
				if (ctx.params.industry && ctx.params.industry.length > 0) {
					query["industry"] = ctx.params.industry;
				}
				query["limit"] = ctx.params.limit;
				query["offset"] = ctx.params.offset;
				let cards = await this.adapter
					.find(query)
					.then((docs) => this.transformDocuments(ctx, {}, docs));

				let card_ids = [];
				for (const card of cards) {
					card_ids.push(card._id);
				}

				if (card_ids.length == 0) {
					return [];
				}
				let likedCards = await ctx.call("like.getUserLikedJobs", {
					user_id: ctx.params.user_id,
					card_ids: card_ids.join(","),
				});

				let likeCardSet = new Set();
				for (const like of likedCards) {
					likeCardSet.add(like.card_id);
				}

				let biz = new Set();
				for (const card of cards) {
					if (likeCardSet.has(card._id)) {
						continue;
					}
					biz.add(card.biz_id);
				}

				const businessDetails = await ctx.call("business.batchGet", {
					biz_ids: [...biz].join(","),
				});

				const bizMap = new Map();
				for (const item of businessDetails) {
					bizMap.set(item._id, item);
				}
				const res = [];
				for (const item of cards) {
					if (likeCardSet.has(item._id)) {
						continue;
					}
					const company = bizMap.get(item.biz_id);

					res.push({
						id: item._id,
						title: item.position,
						company: company.name,
						location: item.city,
						description: item.description,
						moreinfo: item.info,
						image: {
							url: company.icon,
						},
					});
				}
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
