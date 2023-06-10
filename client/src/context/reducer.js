/* eslint-disable import/no-anonymous-default-export */
import {
	USER_LOADING,
	USER_LOADED,
	LOGIN,
	LOGIN_FAILED,
	LOGOUT,
	LOGOUT_FAILED,
	REGISTER,
	REGISTER_FAILED,
	AUTH_ERROR,
	UNAUTH_USER_LOADED,
} from '../types';

export const initialState = {
	isAuthenticated: false,
	isLoading: true,
	error: null,
	user: null,
	token: window.localStorage.getItem('token'),
};

export default (state = initialState, action) => {
	switch (action.type) {
		case USER_LOADING:
			return {
				...state,
				isLoading: true,
			};

		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				...action.payload,
			};

		case UNAUTH_USER_LOADED:
			return {
				...state,
				isAuthenticated: false,
				isLoading: false,
				...action.payload,
			};

		case LOGIN:
		case REGISTER:
			window.localStorage.setItem('token', action.payload.token);

			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				isLoading: false,
			};

		case AUTH_ERROR:
		case LOGIN_FAILED:
		case REGISTER_FAILED:
		case LOGOUT_FAILED:
		case LOGOUT:
			window.localStorage.removeItem('token');
			return {
				...state,
				isAuthenticated: false,
				isLoading: false,
				user: null,
				token: null,
			};

		default:
			return state;
	}
};
