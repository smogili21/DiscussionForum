const { GraphQLScalarType } = require('graphql');

const {
	ApolloServer,
	gql,
	ApolloError,
	AuthenticationError,
} = require('apollo-server');

const userData = require('./data/users');
const postsData = require('./data/posts');

const dateScalar = new GraphQLScalarType({
	name: 'Date',
	parseValue(value) {
		return new Date(value);
	},
	serialize(value) {
		return value.toISOString();
	},
});

const typeDefs = gql`
	scalar Date

	type Query {
		getPost(id: String!): Post
		filterPosts(tags: [String], pageNum: Int, pageSize: Int): [Post]
		getUser(username: String!): User
		getUserInfo(optionalParameter: String): UserInfo
		getPosts(sortBy: String, pageNum: Int, pageSize: Int): [Post]
		searchPosts(searchTerm: String!): [Post]
	}

	type Post {
		_id: ID!
		userPosted: User
		title: String
		description: String!
		date: Date!
		tags: [String]
		usersUpVoted: [User]
		usersDownVoted: [User]
		isReply: Boolean
		replies: [Post]
		parentPost: Post
		isDeleted: Boolean
	}

	type UserInfo {
		firstname: String
		lastname: String
		username: ID!
		email: String
		userUpVotedPosts: [Post]
		userDownVotedPosts: [Post]
		userPosts: [Post]
	}

	type User {
		username: ID!
		userUpVotedPosts: [Post]
		userDownVotedPosts: [Post]
		userPosts: [Post]
	}

	type Mutation {
		signIn(username: String!, password: String!): String
		AddPost(description: String!, title: String!, tags: [String]): Post
		AddComment(description: String!, parentPostID: String!): Post
		AddUser(
			firstname: String!
			lastname: String!
			username: String!
			email: String!
			password: String!
		): User
		EditUser(
			firstname: String
			lastname: String
			email: String
			password: String
		): User
		DeletePost(postID: ID!): Boolean
		EditDescription(postID: ID!, description: String): Post
		AddTagsToPost(postID: ID!, tags: [String]!): Post
		RemoveTagsToPost(postID: ID!, tags: [String]!): Post
		UserUpVotesAPost(postID: ID!): Post
		UserRemoveUpVoteFromAPost(postID: ID!): Post
		UserDownVotesAPost(postID: ID!): Post
		UserRemoveDownVoteFromAPost(postID: ID!): Post
	}
`;

let resolvers = {
	Date: dateScalar,
	Query: {
		getPost: async (_, args) => {
			try {
				const post = await postsData.getPostbyID(args.id);
				return post;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
		filterPosts: async (_, args) => {
			try {
				const filter = await postsData.filterPosts(
					args.tags,
					args.pageSize,
					args.pageNum
				);
				return filter;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},

		getUser: async (_, args) => {
			try {
				const user = await userData.getUserbyUserName(args.username);
				return user;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
		getUserInfo: async (_, __, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const user = await userData.getUserbyID(context.user);
				return user;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
		getPosts: async (_, args) => {
			try {
				const posts = await postsData.getAndSortPosts(
					args.pageSize,
					args.pageNum,
					args.sortBy
				);
				return posts;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		searchPosts: async (_, args) => {
			try {
				const posts = await postsData.searchPosts(args.searchTerm);
				return posts;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
	},

	Post: {
		userPosted: async (parentArgs) => {
			try {
				const user = await userData.getUserbyID(parentArgs.userPosted);
				return user;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
		parentPost: async (parentArgs) => {
			try {
				if (parentArgs.parentPost !== null) {
					const post = await postsData.getPostbyID(
						parentArgs.parentPost
					);
					return post;
				}
				const post = await postsData.getPostbyID(parentArgs._id);
				return post;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
		usersUpVoted: async (parentArgs) => {
			try {
				let users = parentArgs.usersUpvoted;

				users = users.map(async (userId) => {
					return await userData.getUserbyID(userId);
				});

				users = await Promise.all(users);

				return users;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},

		usersDownVoted: async (parentArgs) => {
			try {
				let users = parentArgs.usersDownvoted;

				users = users.map(async (userId) => {
					return await userData.getUserbyID(userId);
				});

				users = await Promise.all(users);

				return users;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},

		replies: async (parentArgs) => {
			try {
				let posts = parentArgs.replies;

				posts = posts.map(async (post) => {
					return await postsData.getPostbyID(post);
				});

				posts = await Promise.all(posts);

				return posts;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
	},

	User: {
		userPosts: async (parentArgs) => {
			try {
				let posts = parentArgs.userPosts;

				posts = posts.map(async (postId) => {
					return await postsData.getPostbyID(postId);
				});

				posts = await Promise.all(posts);

				return posts;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
		userUpVotedPosts: async (parentArgs) => {
			try {
				let posts = parentArgs.userUpvotedPosts;

				posts = posts.map(async (postId) => {
					return await postsData.getPostbyID(postId);
				});

				posts = await Promise.all(posts);

				return posts;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},

		userDownVotedPosts: async (parentArgs) => {
			try {
				let posts = parentArgs.userDownvotedPosts;

				posts = posts.map(async (postId) => {
					return await postsData.getPostbyID(postId);
				});

				posts = await Promise.all(posts);

				return posts;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
	},

	UserInfo: {
		userPosts: async (parentArgs) => {
			try {
				let posts = parentArgs.userPosts;

				posts = posts.map(async (postId) => {
					return await postsData.getPostbyID(postId);
				});

				posts = await Promise.all(posts);

				return posts;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
		userUpVotedPosts: async (parentArgs) => {
			try {
				let posts = parentArgs.userUpvotedPosts;

				posts = posts.map(async (postId) => {
					return await postsData.getPostbyID(postId);
				});

				posts = await Promise.all(posts);

				return posts;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},

		userDownVotedPosts: async (parentArgs) => {
			try {
				let posts = parentArgs.userDownVotedPosts;

				posts = posts.map(async (postId) => {
					return await postsData.getPostbyID(postId);
				});

				posts = await Promise.all(posts);

				return posts;
			} catch (e) {
				console.log(e);
				throw new ApolloError(e, 400);
			}
		},
	},

	Mutation: {
		signIn: async (_, args, context) => {
			if (context.user === undefined) {
				const userInfo = await userData.getUserbyUserName(
					args.username
				);

				if (userInfo.password === args.password) {
					context.user = userInfo._id;
				} else {
					throw new AuthenticationError(
						'username or password is incorrect'
					);
				}
			}
			return context.user;
		},
		AddPost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const post = await postsData.addPost(
					context.user,
					args.description,
					args.tags,
					args.title
				);
				const user = await userData.userAction(
					context.user,
					'userCreatedPost',
					post._id
				);
				return post;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		AddComment: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const comment = await postsData.addPost(
					context.user,
					args.description,
					['comment'],
					'',
					true,
					args.parentPostID
				);
				await postsData.addReplytoPost(args.parentPostID, comment._id);
				const user = await userData.userAction(
					context.user,
					'userCreatedPost',
					comment._id
				);
				return comment;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		AddUser: async (_, args) => {
			try {
				const newUser = await userData.addUser(
					args.firstname,
					args.lastname,
					args.username,
					args.email,
					args.password
				);
				return newUser;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		EditUser: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const updateParams = {};

				if (args.firstname !== null) {
					updateParams.firstname = args.firstname;
				}

				if (args.lastname !== null) {
					updateParams.lastname = args.lastname;
				}

				if (args.email !== null) {
					updateParams.email = args.email;
				}

				if (args.password !== null) {
					updateParams.password = args.password;
				}

				const updatedUser = await userData.editUserProfile(
					context.user,
					updateParams
				);

				return updatedUser;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		DeletePost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const post = await postsData.deletePost(
					args.postID,
					context.user
				);
				const user = await userData.userAction(
					context.user,
					'userDeletesPost',
					args.postID
				);
				return post;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		EditDescription: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const post = await postsData.editDescription(
					args.postID,
					args.description,
					context.user
				);
				return post;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		AddTagsToPost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const addTags = await postsData.addTagsToPost(
					args.postID,
					args.tags,
					context.user
				);
				return addTags;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		RemoveTagsToPost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const removeTags = await postsData.removeTagsFromPost(
					args.postID,
					args.tags,
					context.user
				);
				return removeTags;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		UserUpVotesAPost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const post = await postsData.userUpVotedPost(
					args.postID,
					context.user
				);
				const user = await userData.userAction(
					context.user,
					'userUpvotedPost',
					args.postID
				);
				return post;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		UserDownVotesAPost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const post = await postsData.userDownVotedPost(
					args.postID,
					context.user
				);
				const user = await userData.userAction(
					context.user,
					'userDownvotedPost',
					args.postID
				);
				return post;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		UserRemoveUpVoteFromAPost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const post = await postsData.userRemoveUpVotedPost(
					args.postID,
					context.user
				);
				const user = await userData.userAction(
					context.user,
					'userRemoveUpvotedPost',
					args.postID
				);
				return post;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
		UserRemoveDownVoteFromAPost: async (_, args, context) => {
			try {
				if (context.user === undefined)
					throw new AuthenticationError('you must be logged in');

				const post = await postsData.userRemoveDownVotedPost(
					args.postID,
					context.user
				);
				const user = await userData.userAction(
					context.user,
					'userRemoveDownVotedPost',
					args.postID
				);
				return post;
			} catch (e) {
				throw new ApolloError(e, 400);
			}
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	cors: {
		origin: '*',
		credentials: true,
	},
	context: async ({ req }) => {
		return { user: req.headers.authorization };
	},
});

server.listen().then(({ url }) => {
	console.log(`Server running at ${url}`);
});
