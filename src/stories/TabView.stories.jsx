import React from "react";
import { useArgs } from "@storybook/client-api";
import TabView from "../components/UI/TabView.jsx";
import { FaUserAlt, FaList, FaEye } from 'react-icons/fa';

export default {
  title: "ForwardSlash/TabView",
  component: TabView,
  decorators: []
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (nextVal) => updateArgs({ value: nextVal });
  return <TabView onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "owned",
  tabs: [
    ["owned", "Live Makkah", FaUserAlt],
    ["assigned", "Assigned", FaList],
    ["watched", "Watched", FaEye]
  ],
  disabled: false
};


export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
