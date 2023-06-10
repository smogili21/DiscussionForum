const posts = require('./schema').postsCollection;
const errorHandling = require('./errors');
const { ObjectId } = require('mongodb');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const addPost = async (
	userID,
	description,
	tags,
	title = '',
	isReply = false,
	parentPost = null
) => {
	errorHandling.checkUserPosted(userID);
	errorHandling.checkString(description, 'Desciption');
	errorHandling.checkString(title, 'Title', false); //false because title can be empty

	if (parentPost !== null) {
		errorHandling.checkStringObjectId(parentPost);
	}

	if (!Array.isArray(tags)) {
		throw 'Tags should be of array type. i.e., array of tags';
	}
	tags.map((tag) => errorHandling.checkString(tag, 'Tag'));
	for (let i = 0; i < tags.length; i++) {
		errorHandling.checkString(tags[i], 'Tag');
	}

	const post = new posts({
		userPosted: userID,
		title: title,
		description: description,
		tags: tags,
		usersUpvoted: [],
		usersDownvoted: [],
		isReply: isReply,
		replies: [],
		parentPost: parentPost,
		isDeleted: false,
	});
	const addedInfo = await post.save();
	existingData = await posts.find({ title: post.title });
	if (existingData.length > 0) {
		await client.hsetAsync(
			'userPosted',
			post._id.toString(),
			JSON.stringify(post)
		);
	}
	post._doc._id = post._doc._id.toString();
	return post;
};

const addReplytoPost = async (postID, replyPostID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	errorHandling.checkStringObjectId(replyPostID, 'Replied Post ID');

	const data = await posts.updateOne(
		{ _id: ObjectId(postID) },
		{
			$addToSet: {
				replies: replyPostID,
			},
		}
	);

	if (data.modifiedCount == 0) {
		throw 'Cannot add replied information to the post. ';
	}
	return true;
};

// delete does not mean deleting the post. It means to make the post description as "deleted" and user_info Anonymous.
//if the same user upVotes or downVotes the post, it will remove
const deletePost = async (postID, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	errorHandling.checkStringObjectId(userID, 'User ID');
	const data = await posts.updateOne(
		{
			_id: ObjectId(postID),
			userPosted: userID,
		},
		{
			description: '_**[deleted]**_',
			isDeleted: true,
			$pullAll: {
				usersDownvoted: [userID],
				usersUpvoted: [userID],
			},
		}
	);
	if (data.modifiedCount == 0) {
		throw 'Cannot delete the post.';
	}
	await client.hdelAsync('userPosted', postID);

	return true;
};

//yet to implement sort by feature
const getAndSortPosts = async (pageSize, pageNum, sortBy = 'default') => {
	errorHandling.checkInt(pageSize, 'Page Size');
	errorHandling.checkInt(pageNum, 'Page Number');
	errorHandling.checkString(sortBy, 'Sort By');
	if (pageNum < 1) throw 'Page number cannot be less than 1';
	if (pageSize < 1) throw 'Page size cannot be less than 1';

	const skip = pageSize * (pageNum - 1);

	let data = null;

	if (sortBy === 'default') {
		data = await posts.find({ isReply: false }).skip(skip).limit(pageSize);
	} else if (sortBy === 'time') {
		data = await posts
			.find({ isReply: false })
			.sort({ date: -1 })
			.skip(skip)
			.limit(pageSize);
	} else if (sortBy === 'upvotes') {
		data = await posts
			.find({ isReply: false })
			.sort({ usersUpvoted: -1 })
			.skip(skip)
			.limit(pageSize);
	} else if (sortBy === 'downvotes') {
		data = await posts
			.find({ isReply: false })
			.sort({ usersDownvoted: -1 })
			.skip(skip)
			.limit(pageSize);
	} else {
		throw 'invalid sortby parameter. Sort By parameter can either be time, upvotes, downvotes, default';
	}

	data = data.map((x) => {
		x._doc._id = x._doc._id.toString();
		return x;
	});

	return data;
};

const getPostbyID = async (postID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	const data = await posts.findOne({ _id: ObjectId(postID) });
	if (data === undefined) {
		throw 'Cannot find a post with the given ID: ' + postID;
	}

	data._doc._id = data._doc._id.toString();

	return data;
};

const editDescription = async (postID, description, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	errorHandling.checkString(description, 'Desciption');
	errorHandling.checkStringObjectId(userID, 'User ID');

	const data = await posts.updateOne(
		{ _id: ObjectId(postID), userPosted: userID },
		{
			description: description,
		}
	);

	if (data.modifiedCount == 0) {
		throw 'Cannot update the description of post';
	}
	return await getPostbyID(postID);
};

const addTagsToPost = async (postID, tags, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	tags.map((tag) => errorHandling.checkString(tag, 'Tag'));
	errorHandling.checkStringObjectId(userID, 'User ID');

	tags = tags.map((x) => x.toLowerCase());

	const data = await posts.updateOne(
		{ _id: ObjectId(postID), userPosted: userID },
		{
			$addToSet: {
				tags: { $each: tags },
			},
		}
	);
	if (data.modifiedCount == 0) {
		throw 'Not Authorized to add a tag';
	}

	return await getPostbyID(postID);
};

const removeTagsFromPost = async (postID, tags, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	tags.map((tag) => errorHandling.checkString(tag, 'Tag'));
	errorHandling.checkStringObjectId(userID, 'User ID');

	tags = tags.map((x) => x.toLowerCase());

	const data = await posts.updateOne(
		{ _id: ObjectId(postID), userPosted: userID },
		{
			$pullAll: {
				tags: tags,
			},
		}
	);

	if (data.modifiedCount == 0) {
		throw 'Not Authorized to remove a tag';
	}
	return await getPostbyID(postID);
};

const searchPosts = async (searchTerm) => {
	errorHandling.checkString(searchTerm, 'Search Term');

	const postsList = await posts.find({
		$text: {
			$search: searchTerm,
		},
	});

	return postsList;
};

const userUpVotedPost = async (postID, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	errorHandling.checkStringObjectId(userID, 'User ID');

	const data = await posts.updateOne(
		{ _id: ObjectId(postID) },
		{
			$addToSet: {
				usersUpvoted: userID,
			},
			$pullAll: {
				usersDownvoted: [userID],
			},
		}
	);
	if (data.modifiedCount == 0) {
		throw 'Cannot up vote a post with ID: ' + postID;
	}

	return await getPostbyID(postID);
};

const userRemoveUpVotedPost = async (postID, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	errorHandling.checkStringObjectId(userID, 'User ID');

	const data = await posts.updateOne(
		{ _id: ObjectId(postID) },
		{
			$pullAll: {
				usersUpvoted: [userID],
			},
		}
	);
	if (data.modifiedCount == 0) {
		throw 'Cannot remove upvote from a post with ID: ' + postID;
	}

	return await getPostbyID(postID);
};

const userRemoveDownVotedPost = async (postID, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	errorHandling.checkStringObjectId(userID, 'User ID');

	const data = await posts.updateOne(
		{ _id: ObjectId(postID) },
		{
			$pullAll: {
				usersDownvoted: [userID],
			},
		}
	);
	if (data.modifiedCount == 0) {
		throw 'Cannot remove upvote from a post with ID: ' + postID;
	}

	return await getPostbyID(postID);
};

const userDownVotedPost = async (postID, userID) => {
	errorHandling.checkStringObjectId(postID, 'Post ID');
	errorHandling.checkStringObjectId(userID, 'User ID');

	const data = await posts.updateOne(
		{ _id: ObjectId(postID) },
		{
			$addToSet: {
				usersDownvoted: userID,
			},
			$pullAll: {
				usersUpvoted: [userID],
			},
		}
	);

	if (data.modifiedCount == 0) {
		throw 'Cannot down vote a post with ID: ' + postID;
	}

	return await getPostbyID(postID);
};

const filterPosts = async (tagsToFilter, pageSize = 10, pageNum = 1) => {
	errorHandling.checkInt(pageSize, 'Page Size');
	errorHandling.checkInt(pageNum, 'Page Number');
	if (pageNum < 1) throw 'Page number cannot be less than 1';
	if (pageSize < 1) throw 'Page size cannot be less than 1';
	tagsToFilter.map((tag) => errorHandling.checkString(tag, 'Tag'));
	tagsToFilter = tagsToFilter.map((x) => x.toLowerCase());

	const skip = pageSize * (pageNum - 1);
	let data = await posts
		.find({ tags: { $all: tagsToFilter } })
		.skip(skip)
		.limit(pageSize);

	data = data.map((x) => {
		x._doc._id = x._doc._id.toString();
		return x;
	});

	return data;
};

module.exports = {
	addPost,
	getAndSortPosts,
	getPostbyID,
	removeTagsFromPost,
	addTagsToPost,
	editDescription,
	userDownVotedPost,
	userUpVotedPost,
	filterPosts,
	addReplytoPost,
	deletePost,
	userRemoveUpVotedPost,
	userRemoveDownVotedPost,
	searchPosts,
};

// Testing

//getAndSortPosts(20, 1).then((x) => console.log(x));

// addReplytoPost("61a15b2db890e3dd124a4259", "61a15b2da890e3dd124a4258");
// deletePost("61a19b59583a2ab211d4b383", "61a19b59583a2ab211d4b382");

// getAndSortPosts(1, 2).then((x) => console.log(x));

// getPostbyID("61a0251aca0d7960a3137994").then((x) => console.log(x));

// editDescription(
//   "61a0251aca0d7960a313b994",
//   "efhgkd",
//   "61a0251aca0d7960a313b993"
// );

// filterPosts(["deep learning"], 2, 0).then((x) => console.log(x));

// addTagsToPost(
//   "61a0251aca0d7960a313b994",
//   ["machine learning", "data science"],
//   "61a0251aca0d7960a313b993"
// );

// userDownVotedPost("61a19b59583a2ab211d4b383", "61a19b59583a2ab211d4b382");
// functions to test

// removeTagsFromPost(
//   "61a0251aca0d7960a313b994",
//   ["helddlo", "ds"],
//   "61a0251aca0d7960a313b993"
// );

// addPost(
//   String(ObjectId()),
//   "post description",
//   ["data science", "deep learning"],
//   "post title"
// ).then((x) => {
//   console.log(x);
// });

// getPostbyID("619f21f0c02634027037096f").then((x) => console.log(x));
