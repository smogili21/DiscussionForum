import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import AuthContext from '../context/context';
import Layout from '../layouts/Layout';

function ChatPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const { state } = useContext(AuthContext);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [insideChatRoom, setInsideChatRoom] = useState(false);
	let joinButtonDisplay = null;
	let leaveButtonDisplay = null;
	let chatRoomHeader = null;

	if (!state.isAuthenticated) {
		navigate('/');
	}

	try {
		VoxeetSDK.initialize(
			'KPtPBC3RfX0l85Qm9RkIZw==',
			'AMaODzmyjiEot7BlbVxcQ44s0KkM8tt3tt4edofmZqg='
		);
	} catch (e) {
		console.log(e);
	}

	if (!sessionStarted) {
		const sessionopen = async () => {
			try {
				console.log(sessionStarted);

				setLoading(false);
				setSessionStarted(true);
				await VoxeetSDK.session.open({ name: state.user.username });
			} catch (e) {
				console.log('ERROR : ' + e);
			}
		};
		sessionopen();
	}

	const joinChat = async () => {
		let conferenceAlias = 'global';
		console.log('CON CREATED');
		VoxeetSDK.conference
			.create({ alias: conferenceAlias })
			.then((conference) => VoxeetSDK.conference.join(conference, {}))
			.then(() => {
				joinButtonDisplay = (
					<button id='join-btn-chat' onClick={joinChat} disabled>
						Join
					</button>
				);
				leaveButtonDisplay = (
					<button id='leave-btn-chat' onClick={leaveChat}>
						Leave
					</button>
				);
			})
			.catch((err) => console.error(err));
		setInsideChatRoom(true);
	};

	const leaveChat = () => {
		VoxeetSDK.conference
			.leave()
			.then(() => {
				joinButtonDisplay = (
					<button id='join-btn-chat' onClick={joinChat}>
						Join Chat Room
					</button>
				);
				leaveButtonDisplay = (
					<button id='leave-btn-chat' onClick={leaveChat} hidden>
						Leave Chat Room
					</button>
				);
			})
			.catch((err) => console.error(err));
		setInsideChatRoom(false);
	};

	if (insideChatRoom) {
		joinButtonDisplay = (
			<button id='join-btn-chat' onClick={joinChat} hidden>
				Join Chat Room
			</button>
		);
		leaveButtonDisplay = (
			<button id='leave-btn-chat' onClick={leaveChat}>
				Leave Chat Room
			</button>
		);
		chatRoomHeader = (
			<div>
				<h1 id='name-message'>
					You are inside the chat room. We're listening!!!{' '}
				</h1>
			</div>
		);
	} else {
		joinButtonDisplay = (
			<button id='join-btn-chat' onClick={joinChat}>
				Join Chat Room
			</button>
		);
		leaveButtonDisplay = (
			<button id='leave-btn-chat' onClick={leaveChat} hidden>
				Leave Chat Room
			</button>
		);
		chatRoomHeader = (
			<div>
				<h1 id='name-message'>
					{' '}
					Express your thoughts by joining the global audio chatroom.{' '}
				</h1>
			</div>
		);
	}

	if (loading) {
		return <div> Loading.... </div>;
	} else {
		return (
			<Layout>
				{chatRoomHeader}
				<div id='app'>
					<div className='chatForm'>
						{joinButtonDisplay}
						{leaveButtonDisplay}
					</div>
				</div>
			</Layout>
		);
	}
}

export default ChatPage;
