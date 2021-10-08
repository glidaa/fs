import React from 'react';
import {action} from '@storybook/addon-actions';

import Signup from '../componentStories/Signup/Signup';

export default {
    title: 'Signup',
    component: Signup,
};

export const Text = () => <Signup signup="Signup" login="Log in to account" email="Enter your email address" password="Create your password" passwordTwo="Confirm your password">Signup for Forwardslash</Signup>;