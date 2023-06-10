import { createContext } from 'react';
import { initialState } from './reducer';

const AuthContext = createContext(initialState);

export default AuthContext;
