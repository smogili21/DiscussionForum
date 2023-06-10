import { gql } from '@apollo/client';

const SIGN_IN = gql`
	mutation SignIn($username: String!, $password: String!) {
		signIn(username: $username, password: $password)
	}
`;

const SIGN_UP = gql`
	mutation AddUser(
		$firstname: String!
		$lastname: String!
		$username: String!
		$email: String!
		$password: String!
	) {
		AddUser(
			firstname: $firstname
			lastname: $lastname
			username: $username
			email: $email
			password: $password
		) {
			username
		}
	}
`;

const GET_USER_INFO = gql`
	query GetUser {
		getUserInfo {
			firstname
			lastname
			username
		}
	}
`;

const GET_POSTS = gql`
	query Query($pageSize: Int, $pageNum: Int, $sortBy: String) {
		getPosts(pageSize: $pageSize, pageNum: $pageNum, sortBy: $sortBy) {
			_id
			userPosted {
				username
			}
			title
			description
			date
			tags
			isReply
			isDeleted
			parentPost {
				_id
				title
			}
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
			replies {
				_id
			}
		}
	}
`;

const GET_POST = gql`
	query GetPost($getPostId: String!) {
		getPost(id: $getPostId) {
			_id
			userPosted {
				username
			}
			title
			description
			date
			tags
			isReply
			isDeleted
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
			parentPost {
				_id
			}
			replies {
				_id
				description
				userPosted {
					username
				}
				date
				usersUpVoted {
					username
				}
				usersDownVoted {
					username
				}
				parentPost {
					_id
				}
				isReply
				isDeleted
				replies {
					_id
					description
					userPosted {
						username
					}
					date
					usersUpVoted {
						username
					}
					usersDownVoted {
						username
					}
					parentPost {
						_id
					}
					isReply
					isDeleted
				}
			}
		}
	}
`;

const ADD_POST = gql`
	mutation AddPost($description: String!, $title: String!, $tags: [String]) {
		AddPost(description: $description, title: $title, tags: $tags) {
			_id
			userPosted {
				username
			}
			title
			description
			date
			tags
			isReply
			isDeleted
			parentPost {
				_id
			}
		}
	}
`;

const ADD_COMMENT = gql`
	mutation AddComment($description: String!, $parentPostId: String!) {
		AddComment(description: $description, parentPostID: $parentPostId) {
			parentPost {
				replies {
					_id
					userPosted {
						username
					}
					description
					date
					tags
					usersUpVoted {
						username
					}
					usersDownVoted {
						username
					}
					isReply
					isDeleted
					replies {
						_id
					}
				}
			}
		}
	}
`;

const DELETE_POST = gql`
	mutation DeletePost($postId: ID!) {
		DeletePost(postID: $postId)
	}
`;

const USER_UPVOTES_A_POST = gql`
	mutation UserUpVotesAPost($postId: ID!) {
		UserUpVotesAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

const USER_DOWNVOTES_A_POST = gql`
	mutation UserDownVotesAPost($postId: ID!) {
		UserDownVotesAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

const USER_REMOVE_UPVOTE_FROM_POST = gql`
	mutation UserRemoveUpVoteFromAPost($postId: ID!) {
		UserRemoveUpVoteFromAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

const USER_REMOVE_DOWNVOTE_FROM_POST = gql`
	mutation UserRemoveDownVoteFromAPost($postId: ID!) {
		UserRemoveDownVoteFromAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

const USER_ACCOUNT_PAGE = gql`
	query GetUser($username: String!) {
		getUser(username: $username) {
			username
			userPosts {
				_id
				userPosted {
					username
				}
				title
				description
				date
				tags
				usersUpVoted {
					username
				}
				usersDownVoted {
					username
				}
				isReply
				isDeleted
			}
			userUpVotedPosts {
				_id
				userPosted {
					username
				}
				title
				description
				date
				tags
				usersUpVoted {
					username
				}
				usersDownVoted {
					username
				}
				isReply
				isDeleted
			}
			userDownVotedPosts {
				_id
				userPosted {
					username
				}
				title
				description
				date
				tags
				usersUpVoted {
					username
				}
				usersDownVoted {
					username
				}
				isReply
				isDeleted
			}
		}
	}
`;

export {
	SIGN_IN,
	SIGN_UP,
	GET_USER_INFO,
	GET_POSTS,
	GET_POST,
	ADD_POST,
	ADD_COMMENT,
	DELETE_POST,
	USER_UPVOTES_A_POST,
	USER_DOWNVOTES_A_POST,
	USER_REMOVE_UPVOTE_FROM_POST,
	USER_REMOVE_DOWNVOTE_FROM_POST,
	USER_ACCOUNT_PAGE,
};
