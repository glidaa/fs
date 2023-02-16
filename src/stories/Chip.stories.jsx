import React from "react";

import Chip from "../components/UI/Chip";

export default {
  title: "ForwardSlash/Chip",
  component: Chip,
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

const Template = (args) => <Chip {...args} />;

export const Default = Template.bind({});
Default.args = {
  primaryLabel: "John D.",
  secondary: "@Johny",
  actionIcon: testIcon,
  actionAllowed: true,
};

export const ActionNotAllowed = Template.bind({});
ActionNotAllowed.args = {
  ...Default.args,
  actionAllowed: false,
};

export const WithImageAvatar = Template.bind({});
WithImageAvatar.args = {
  ...Default.args,
  avatarImage: "https://i.pravatar.cc/150?img=68",
  avatarInitials: "JD",
  avatarAlt: "John Doe",
};

export const WithLetterAvatar = Template.bind({});
WithLetterAvatar.args = {
  ...Default.args,
  avatarInitials: "JD",
  avatarAlt: "John Doe",
};

export const WithIconAvatar = Template.bind({});
WithIconAvatar.args = {
  ...Default.args,
  avatarIcon: testIcon,
  avatarAlt: "John Doe",
};