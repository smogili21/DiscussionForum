const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(
	'mongodb+srv://roundtable:roundtable@cluster0.j8soz.mongodb.net/RoundTable?retryWrites=true&w=majority'
);

const postsCollection = mongoose.model('Posts', {
	userPosted: Schema.Types.Mixed,
	title: String,
	description: String,
	date: { type: Date, default: Date.now },
	tags: [String],
	usersUpvoted: [String],
	usersDownvoted: [String],
	isReply: Boolean,
	isDeleted: { type: Boolean, default: false },
	replies: [String],
	parentPost: String,
});

postsCollection.schema.index({ title: 'text', description: 'text' });

const usersCollection = mongoose.model('Users', {
	firstname: String,
	lastname: String,
	username: String,
	email: String,
	password: String,
	userUpvotedPosts: [String],
	userDownvotedPosts: [String],
	userPosts: [String],
});

module.exports = {
	usersCollection,
	postsCollection,
};
