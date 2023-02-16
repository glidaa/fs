import React from "react";
import { useArgs } from "@storybook/client-api";

import ComboBox from "../components/UI/fields/ComboBox";

export default {
  title: "ForwardSlash/Fields/ComboBox",
  component: ComboBox,
  decorators: [],
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <ComboBox onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "todo",
  label: "Status",
  options: [
    ["todo", "Todo"],
    ["pending", "Pending"],
    ["done", "Done"],
  ],
  readOnly: false,
  disabled: false
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  ...Default.args,
  readOnly: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
