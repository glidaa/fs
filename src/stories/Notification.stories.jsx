import React from "react";

import Notification from "../components/UI/Notification";

export default {
  title: "ForwardSlash/Notification",
  component: Notification,
  decorators: [],
  argTypes: {
    anim: {
      control: { type: "range", min: 0, max: 1, step: 1 },
    },
  },
};

const Template = (args) => <Notification {...args} />;

export const Default = Template.bind({});
Default.args = {
  senderData: {
    avatar: "https://i.pravatar.cc/150?img=68",
    initials: "JD",
    firstName: "John",
    lastName: "Doe",
  },
  notificationData: {
    id: "798d0941-6da7-46be-8cb7-10e815c6c808",
    type: "ASSIGNMENT",
    payload: {
      link: "userscience/original-own/19",
    },
    createdAt: "2022-02-05T23:47:01.023Z",
    updatedAt: "2022-02-05T23:47:01.023Z",
    owner: "GeeekyBoy",
    sender: "userscience",
  },
  headsUp: false,
  anim: 0,
};
