import { useMutation } from '@apollo/client';
import { useState } from 'react';

import toast from 'react-hot-toast';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { ADD_COMMENT } from '../queries';

const WriteReply = ({ parentPostId, closeFunction, handleReply }) => {
	const [value, setValue] = useState('');
	const [selectedTab, setSelectedTab] = useState('write');

	const [addComment, { loading }] = useMutation(ADD_COMMENT, {
		variables: {
			description: value,
			parentPostId,
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (value.trim() === '') {
			toast.error('Your comment cannot be empty!', {
				icon: '😶',
			});
		} else {
			await addComment()
				.then((res) => {
					const { AddComment } = res.data;

					toast.success('Comment posted!', {
						icon: '😉',
					});

					handleReply(AddComment.parentPost);
					closeFunction();
				})
				.catch((err) => {
					toast.error(err.message, {
						icon: '😓',
					});
					closeFunction();
				});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Stack direction='column' spacing={3} paddingY={4}>
				<ReactMde
					value={value}
					onChange={setValue}
					selectedTab={selectedTab}
					onTabChange={setSelectedTab}
					generateMarkdownPreview={(markdown) =>
						Promise.resolve(<ReactMarkdown children={markdown} />)
					}
					childProps={{
						writeButton: {
							tabIndex: -1,
						},
					}}
				/>

				<Button
					disabled={loading}
					type='submit'
					variant='contained'
					sx={{ marginTop: 3 }}>
					Commment
				</Button>
			</Stack>
		</form>
	);
};

export default WriteReply;
