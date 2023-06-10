import Container from '@mui/material/Container';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
	return (
		<>
			<Navbar />
			<Container component='main' sx={{ paddingY: 10 }}>
				{children}
			</Container>
		</>
	);
};

export default Layout;
