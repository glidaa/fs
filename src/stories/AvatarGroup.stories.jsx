import React from "react";

import AvatarGroup from "../components/UI/AvatarGroup";

export default {
  title: "ForwardSlash/Avatar Group",
  component: AvatarGroup,
  decorators: [],
};

const Template = (args) => <AvatarGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  max: 100,
  size: 128,
  users: [
    {
      avatar: "https://i.pravatar.cc/150?img=4",
      initials: "JD",
      name: "John Doe",
      color: "orange",
    },
    {
      avatar: null,
      initials: "JD",
      name: "John Doe",
      color: "hotpink",
    },
    {
      avatar: "https://i.pravatar.cc/150?img=59",
      initials: "JD",
      name: "John Doe",
    },
    {
      avatar: "https://i.pravatar.cc/150?img=65",
      initials: "JD",
      name: "John Doe",
    },
    {
      avatar: "https://i.pravatar.cc/150?img=70",
      initials: "JD",
      name: "John Doe",
    },
  ],
};

export const Maximum = Template.bind({});
Maximum.args = {
  ...Default.args,
  max: 4
};
