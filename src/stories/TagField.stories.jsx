import React from "react";
import { useArgs } from "@storybook/client-api";

import TagField from "../components/UI/fields/TagField";

export default {
  title: "ForwardSlash/Fields/Tag Field",
  component: TagField,
  decorators: []
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <TagField onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: ["bug", "urgent", "important"],
  label: "Tags",
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
