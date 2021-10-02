import React from 'react';
import {action} from '@storybook/addon-actions';

import Button from '../componentStories/Button/Button';

export default {
    title: 'Button',
    component: Button,
};

export const Text = () => <Button>Signup</Button>;
