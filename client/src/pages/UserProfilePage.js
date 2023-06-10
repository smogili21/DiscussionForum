import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';

import Box from '@mui/system/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Layout from '../layouts/Layout';
import { USER_ACCOUNT_PAGE } from '../queries';
import QueryCard from '../components/QueryCard';

const UserProfilePage = () => {
	const { username } = useParams();
	const { data, loading, error } = useQuery(USER_ACCOUNT_PAGE, {
		variables: { username },
		fetchPolicy: 'network-only',
	});

	console.log(data);

	if (loading) {
		return (
			<Layout>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						width: '100%',
					}}>
					<CircularProgress />
				</Box>
			</Layout>
		);
	}

	if (error) {
		return <Layout>{error.message}</Layout>;
	}

	if (data) {
		const { getUser } = data;

		return (
			<Layout>
				<Typography component='h1' variant='h3' gutterBottom>
					{getUser.username}'s posts
				</Typography>
				<Grid container direction='column'>
					{getUser.userPosts.length === 0 && (
						<Typography component='h2' variant='h5'>
							No posts to show!
						</Typography>
					)}
					{getUser.userPosts.map((post) => (
						<Grid item key={post._id} xs>
							<QueryCard
								post={post}
								mode='list'
								location='userPage'
							/>
						</Grid>
					))}
				</Grid>
			</Layout>
		);
	}
};

export default UserProfilePage;
