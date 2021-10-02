import React from 'react';
import {action} from '@storybook/addon-actions';

import Header from '../componentStories/Header/Header';

export default {
    title: 'Header',
    component: Header,
};

export const Text = () => <Header>Hello Header</Header>;
