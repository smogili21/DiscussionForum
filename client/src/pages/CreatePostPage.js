import { useMutation } from '@apollo/client';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import toast from 'react-hot-toast';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import { ADD_POST } from '../queries';
import Layout from '../layouts/Layout';
import AuthContext from '../context/context';

const CreatePostPage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};
	const { state } = useContext(AuthContext);

	const [title, setTitle] = useState('');
	const [value, setValue] = useState('');
	const [tags, setTags] = useState([]);
	const [tagText, setTagText] = useState('');
	const [selectedTab, setSelectedTab] = useState('write');

	const [addPost, { loading }] = useMutation(ADD_POST, {
		variables: {
			description: value,
			title: title,
			tags: tags,
		},
	});

	useEffect(() => {
		if (!state.isAuthenticated) {
			handleNavigation('/');
		}
	}, [state.isAuthenticated]);

	const handleAddTag = () => {
		if (tagText.trim() === '') {
			toast.error('A tag cannot be empty!', {
				icon: '😅',
			});
		} else {
			setTags([...tags, tagText]);

			setTagText('');
		}
	};

	const handleTagDelete = (tag) => {
		const tagsCopy = tags.filter((item) => item !== tag);

		setTags([...tagsCopy]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (value.trim() === '') {
			toast.error('Post description cannot be empty!', {
				icon: '😶',
			});
		} else {
			await addPost()
				.then(({ data }) => {
					toast.success('Posted successfully!', {
						icon: '😉',
					});
					handleNavigation(`/post/${data.AddPost._id}`);
				})
				.catch((err) => toast.error(err.message, { icon: '😓' }));
		}
	};

	return (
		<Layout>
			<form onSubmit={handleSubmit}>
				<Stack direction='column' spacing={3} paddingY={4}>
					<TextField
						id='title'
						name='title'
						type='text'
						required
						placeholder='post title'
						label='post title'
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					<ReactMde
						value={value}
						onChange={setValue}
						selectedTab={selectedTab}
						onTabChange={setSelectedTab}
						generateMarkdownPreview={(markdown) =>
							Promise.resolve(
								<ReactMarkdown children={markdown} />
							)
						}
						childProps={{
							writeButton: {
								tabIndex: -1,
							},
						}}
					/>

					<Grid container gap={1}>
						{tags.length !== 0 &&
							tags.map((tag) => (
								<Grid key={tag} item>
									<Chip
										label={tag}
										onDelete={() => handleTagDelete(tag)}
									/>
								</Grid>
							))}
					</Grid>

					<Stack direction='row' spacing={2} marginY={3}>
						<TextField
							id='tag'
							name='tag'
							type='text'
							size='small'
							placeholder='add a tag'
							label='add a tag'
							value={tagText}
							onChange={(e) => setTagText(e.target.value)}
						/>

						{tagText !== '' && (
							<IconButton
								variant='outlined'
								color='primary'
								onClick={() => handleAddTag()}>
								<AddIcon />
							</IconButton>
						)}
					</Stack>

					<Button
						disabled={loading}
						type='submit'
						variant='contained'
						sx={{ marginTop: 3 }}>
						Create Post
					</Button>
				</Stack>
			</form>
		</Layout>
	);
};

export default CreatePostPage;
