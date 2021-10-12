import React from 'react';
import {action} from '@storybook/addon-actions';

import Login from '../componentStories/Login/Login';

export default {
    title: 'Login',
    component: Login,
};

export const Text = () => <Login login="Login" resetPassword="Reset password" email="Enter your email address" password="Create your password" createAccount="Create account">Log in to your account</Login>;