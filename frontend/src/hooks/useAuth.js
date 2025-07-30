/**
 * @file useAuth.js
 * @description This file defines a custom hook for accessing the authentication context.
 * @module hooks/useAuth
 * @requires react
 * @requires ../context/AuthContext
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * @function useAuth
 * @description A custom hook that provides access to the authentication context.
 * @returns {object} The authentication context.
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;