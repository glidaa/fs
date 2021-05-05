import React from 'react';

import { Specials } from '../Specials';

export default {
  title: 'Specials Dropdown',
  component: Specials
};

const Template = (args) => <Specials {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onChooseSuggestion: null,
  suggestionsList: [
    "s",
    "l",
    "x",
    "q"
  ],
  suggestionsCondition: [
    true,
    true,
    true,
    false
  ],
  suggestionsDescription: [
    "Login to save your tasks",
    "Create a new account",
    "Mark this note as done",
    "Logout"
  ]
};
