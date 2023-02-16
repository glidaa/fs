import React from "react";
import { useArgs } from "@storybook/client-api";

import Toggle from "../components/UI/fields/Toggle";

export default {
  title: "ForwardSlash/Fields/Toggle",
  component: Toggle,
  decorators: []
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <Toggle onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: false,
  label: "label",
  error: "",
  readOnly: false,
  disabled: false,
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  error: "error message",
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
