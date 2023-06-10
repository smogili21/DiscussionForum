import { useLazyQuery, useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AuthContext from '../context/context';
import Layout from '../layouts/Layout';
import { GET_USER_INFO, SIGN_IN } from '../queries';
import { LOGIN } from '../types';

const LoginPage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const { state, dispatch } = useContext(AuthContext);

	const [signIn] = useMutation(SIGN_IN, {
		variables: { username, password },
	});
	const [getUser] = useLazyQuery(GET_USER_INFO, {
		context: { headers: { authorization: localStorage.getItem('token') } },
	});

	if (!loading && state.isAuthenticated) {
		handleNavigation('/');
	}

	const handleLogin = (e) => {
		e.preventDefault();
		setLoading(true);

		signIn()
			.then(({ data }) => {
				console.log(data);
				const token = data.signIn;

				getUser().then((res) => {
					const user = data.getUserInfo;
					const payload = { token, user };

					dispatch({ type: LOGIN, payload });

					setLoading(false);

					toast.success('Successfully logged in!', { icon: '😎' });
					handleNavigation('/');
				});
			})
			.catch((err) => {
				toast.success(err.message, { icon: '😓' });
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<Layout>
			<Typography component='h1' variant='h3' gutterBottom>
				Login here
			</Typography>

			<form onSubmit={handleLogin}>
				<Stack direction='column' gap={4}>
					<TextField
						id='username'
						name='username'
						type='text'
						required
						placeholder='username'
						label='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						id='password'
						name='password'
						type='password'
						required
						placeholder='password'
						label='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button disabled={loading} type='submit'>
						login
					</Button>
				</Stack>
			</form>
		</Layout>
	);
};

export default LoginPage;
