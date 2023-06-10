import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/client';

import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AuthContext from '../context/context';
import Layout from '../layouts/Layout';
import { GET_USER_INFO, SIGN_UP, SIGN_IN } from '../queries';
import { LOGIN } from '../types';

const RegisterPage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [loading, setLoading] = useState(false);

	const { state, dispatch } = useContext(AuthContext);

	const [signIn] = useMutation(SIGN_IN, {
		variables: { username, password },
	});
	const [register] = useMutation(SIGN_UP, {
		variables: { firstname, lastname, username, email, password },
	});
	const [getUser] = useLazyQuery(GET_USER_INFO, {
		context: { headers: { authorization: localStorage.getItem('token') } },
	});

	if (!loading && state.isAuthenticated) {
		handleNavigation('/');
	}

	const handleRegister = (e) => {
		e.preventDefault();
		setLoading(true);

		if (password !== password2) {
			alert('Passwords dont match!');
		} else {
			register()
				.then((res) => {
					signIn()
						.then(({ data }) => {
							console.log(data);
							const token = data.signIn;

							getUser().then((_) => {
								const user = data.getUserInfo;
								const payload = { token, user };

								dispatch({ type: LOGIN, payload });

								setLoading(false);

								toast.success('Successfully signed up!', {
									icon: '😍',
								});
								handleNavigation('/');
							});
						})
						.catch((err) => {
							toast.success(err.message, { icon: '😓' });
							console.log(err);
							setLoading(false);
						});
				})
				.catch((err) => {
					toast.success(err.message, { icon: '😓' });
					console.log(err);
					setLoading(false);
				});
		}
	};

	return (
		<Layout>
			<Typography component='h1' variant='h3' gutterBottom>
				Register here
			</Typography>

			<form onSubmit={handleRegister}>
				<Stack direction='column' gap={4}>
					<TextField
						id='firstname'
						name='firstname'
						type='text'
						required
						placeholder='first name'
						label='first name'
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
					/>

					<TextField
						id='lastname'
						name='lastname'
						type='text'
						required
						placeholder='last name'
						label='last name'
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
					/>

					<TextField
						id='email'
						name='email'
						type='email'
						required
						placeholder='email'
						label='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

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

					<TextField
						id='password2'
						name='password2'
						type='password'
						required
						placeholder='confirm password'
						label='confirm password'
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
					/>

					<Button type='submit'>register</Button>
				</Stack>
			</form>
		</Layout>
	);
};

export default RegisterPage;
