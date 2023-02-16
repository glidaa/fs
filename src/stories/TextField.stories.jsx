import React from "react";
import { useArgs } from "@storybook/client-api";

import TextField from "../components/UI/fields/TextField";

export default {
  title: "ForwardSlash/Fields/Text Field",
  component: TextField,
  decorators: [],
  argTypes: {
    type: {
      options: ["text", "password", "email", "number", "tel"],
      control: { type: "select" },
    },
  },
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <TextField onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  type: "text",
  value: "demo text",
  placeholder: "",
  label: "label",
  prefix: "",
  suffix: "",
  error: "",
  readOnly: false,
  disabled: false,
};

export const Prefix = Template.bind({});
Prefix.args = {
  ...Default.args,
  prefix: "prefix",
};

export const Suffix = Template.bind({});
Suffix.args = {
  ...Default.args,
  suffix: "suffix",
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
