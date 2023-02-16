import React from "react";

import ListItem from "../components/UI/ListItem";

export default {
  title: "ForwardSlash/ListItem",
  component: ListItem,
  decorators: []
};

const TestIcon = (props) => (
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

const Template = (args) => <ListItem onSelect={(e) => console.log(e)} {...args} />;

export const Default = Template.bind({});
Default.args = {
  primaryLabel: "John D.",
  secondaryLabel: "",
  selected: false,
  disabled: false,
};

export const WithSecondary = Template.bind({});
WithSecondary.args = {
  ...Default.args,
  secondaryLabel: "@Johny",
};

export const WithPrefix = Template.bind({});
WithPrefix.args = {
  ...Default.args,
  prefix: <TestIcon width={16} height={16} />,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};