import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@apollo/client';

import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import AuthContext from '../context/context';
import Layout from '../layouts/Layout';
import { GET_POSTS } from '../queries';
import QueryCard from '../components/QueryCard';
import { Chip } from '@mui/material';

const filters = ['default', 'time', 'upvotes', 'downvotes'];

const HomePage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const [hasMoreResults, setHasMoreResults] = useState(true);
	const [currentFilter, setCurrentFilter] = useState('default');

	const { state } = useContext(AuthContext);

	const { data, error, loading, fetchMore } = useQuery(GET_POSTS, {
		variables: { pageNum: 1, pageSize: 10, sortBy: currentFilter },
		fetchPolicy: 'network-only',
	});

	const handleFilter = (filter) => {
		setCurrentFilter(filter);
	};
	const handleFetchMore = (getPosts) =>
		fetchMore({
			variables: {
				pageNum: Math.ceil(getPosts.length / 10) + 1,
				pageSize: 10,
				sortBy: currentFilter,
			},
			updateQuery: (prevResult, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prevResult;
				}

				if (fetchMoreResult.getPosts.length < 10) {
					setHasMoreResults(false);
				}

				return {
					...prevResult,
					getPosts: [
						...prevResult.getPosts,
						...fetchMoreResult.getPosts,
					],
				};
			},
		});

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
		const { getPosts } = data;

		return (
			<Layout>
				<Typography component='h1' variant='h3' gutterBottom>
					Home
				</Typography>
				<Grid container direction='column'>
					<Grid
						container
						alignItems='center'
						justifyContent='center'
						gap={4}
						paddingY={2}>
						{filters.map((filter) => (
							<Grid item key={filter}>
								<Chip
									label={filter}
									color={
										filter === currentFilter
											? 'primary'
											: 'default'
									}
									onClick={() => handleFilter(filter)}
								/>
							</Grid>
						))}
					</Grid>

					{getPosts.length === 0 && (
						<Typography component='h2' variant='h5'>
							No posts to show!
						</Typography>
					)}
					{getPosts.map((post) => (
						<Grid item key={post._id} xs>
							<QueryCard post={post} mode='list' />
						</Grid>
					))}

					{hasMoreResults && (
						<Button
							onClick={() => handleFetchMore(getPosts)}
							startIcon={<KeyboardArrowDownIcon />}
							sx={{ marginTop: 2 }}>
							load more
						</Button>
					)}
					{!hasMoreResults && (
						<Box
							marginY={2}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Typography component='p' variant='overline'>
								No more posts to show!
							</Typography>
						</Box>
					)}
				</Grid>

				{state.isAuthenticated && (
					<Fab
						variant='extended'
						sx={{ position: 'fixed', bottom: 16, right: 16 }}
						onClick={() => handleNavigation('/create-post')}>
						<EditIcon sx={{ mr: 1 }} />
						Create Post
					</Fab>
				)}
			</Layout>
		);
	}
};

export default HomePage;
