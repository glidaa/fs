import React from "react";

import IconButton from "../components/UI/IconButton";

export default {
  title: "ForwardSlash/IconButton",
  component: IconButton,
  decorators: []
};

const testIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
  >
    <circle
      cx={256}
      cy={256}
      r={192}
      fill="none"
      stroke="currentColor"
      strokeWidth={32}
    />
  </svg>
);

const Template = (args) => <IconButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Button",
  icon: testIcon,
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  icon: testIcon,
  disabled: true,
};
