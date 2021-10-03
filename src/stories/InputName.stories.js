import React from 'react';
import {action} from '@storybook/addon-actions';

import InputName from '../componentStories/InputName/InputName';

export default {
    title: 'InputName',
    component: InputName,
};

export const Text = () => <InputName/>;