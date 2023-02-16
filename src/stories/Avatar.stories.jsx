import React from "react";

import Avatar from "../components/UI/Avatar";

export default {
  title: "ForwardSlash/Avatar",
  component: Avatar,
  decorators: [],
};

const Template = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 128,
  image: "https://i.pravatar.cc/150?img=68",
  initials: "JD",
  alt: "John Doe",
  circular: false,
};

export const Circular = Template.bind({});
Circular.args = {
  ...Default.args,
  circular: true,
};

export const Initials = Template.bind({});
Initials.args = {
  ...Default.args,
  avatar: null,
  initials: "JD",
  name: "John Doe",
};

export const Initial = Template.bind({});
Initial.args = {
  ...Default.args,
  avatar: null,
  initials: null,
  name: "John Doe",
};
