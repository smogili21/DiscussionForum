import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';

import Box from '@mui/system/Box';
import CircularProgress from '@mui/material/CircularProgress';

import QueryCard from '../components/QueryCard';
import Layout from '../layouts/Layout';
import { GET_POST } from '../queries';

const PostPage = () => {
	const { id } = useParams();

	const { data, loading, error } = useQuery(GET_POST, {
		variables: { getPostId: id },
		fetchPolicy: 'network-only',
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
		const postData = data.getPost;

		return (
			<Layout>
				<QueryCard post={postData} mode='single' />
			</Layout>
		);
	}
};

export default PostPage;
