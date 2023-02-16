import React from "react";

import ProgressBar from "../components/UI/ProgressBar";

export default {
  title: "ForwardSlash/Progress Bar",
  component: ProgressBar,
  decorators: [],
};

const Template = (args) => <ProgressBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  radius: 58,
  max: 100,
  value: 32,
};
