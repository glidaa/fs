import React from "react";
import { useArgs } from "@storybook/client-api";

import Textarea from "../components/UI/fields/Textarea";

export default {
  title: "ForwardSlash/Fields/Textarea",
  component: Textarea,
  decorators: []
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <Textarea onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "demo text\nYou can write multiple lines of text here.",
  placeholder: "",
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
