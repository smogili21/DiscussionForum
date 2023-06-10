import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		common: { black: '#000', white: '#fff' },
		background: { paper: '#fff', default: '#fafafa' },
		primary: {
			light: 'rgba(136, 255, 255, 1)',
			main: 'rgba(77, 208, 225, 1)',
			dark: 'rgba(0, 159, 175, 1)',
			contrastText: 'rgba(0, 0, 0, 1)',
		},
		secondary: {
			light: 'rgba(199, 164, 255, 1)',
			main: 'rgba(149, 117, 205, 1)',
			dark: 'rgba(101, 73, 156, 1)',
			contrastText: 'rgba(255, 255, 255, 1)',
		},
		error: {
			light: '#e57373',
			main: '#f44336',
			dark: '#d32f2f',
			contrastText: '#fff',
		},
		text: {
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.54)',
			disabled: 'rgba(0, 0, 0, 0.38)',
			hint: 'rgba(0, 0, 0, 0.38)',
		},
	},
});

export default theme;
