import React from "react";
import { useArgs } from "@storybook/client-api";

import Checkbox from "../components/UI/fields/Checkbox";

export default {
  title: "ForwardSlash/Fields/Checkbox",
  component: Checkbox,
  decorators: []
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <Checkbox onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: false,
  label: "label",
  readOnly: false,
  disabled: false,
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
