import { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import toast, { Toaster } from 'react-hot-toast';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';
import 'react-mde/lib/styles/css/react-mde-all.css';

import { GET_USER_INFO } from './queries';
import authReducer, { initialState } from './context/reducer';
import AuthContext from './context/context';
import { USER_LOADED, UNAUTH_USER_LOADED } from './types';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';

function App() {
	const [getUser, { data }] = useLazyQuery(GET_USER_INFO, {
		context: { headers: { authorization: localStorage.getItem('token') } },
	});
	const [state, dispatch] = useReducer(authReducer, initialState);
	const value = { state, dispatch };

	useEffect(() => {
		getUser();

		if (data) {
			const user = data.getUserInfo;

			toast.success(`Welcome back, ${user.firstname}!`, { icon: '😊' });

			dispatch({ type: USER_LOADED, payload: { user } });
		} else {
			dispatch({ type: UNAUTH_USER_LOADED, payload: {} });
		}
	}, [data]);

	if (state.isLoading && !state.isAuthenticated)
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
					width: '100vw',
				}}>
				<CircularProgress size='3rem' />
			</Box>
		);

	return (
		<div>
			<AuthContext.Provider value={value}>
				<Toaster toastOptions={{ duration: 3500 }} />
				<Router>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
						<Route path='/chat' element={<ChatPage />} />
						<Route
							path='/create-post'
							element={<CreatePostPage />}
						/>
						<Route path='/post/:id' element={<PostPage />} />
						<Route
							path='/user/:username'
							element={<UserProfilePage />}
						/>
					</Routes>
				</Router>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
