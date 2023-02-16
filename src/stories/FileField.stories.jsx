import React from "react";
import { useArgs } from "@storybook/client-api";

import FileField from "../components/UI/fields/FileField";

export default {
  title: "ForwardSlash/Fields/FileField",
  component: FileField,
  decorators: [],
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => console.log(e.target.files);
  return <FileField onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: "attachment",
  multiple: false,
};

export const Multiple = Template.bind({});
Multiple.args = {
  ...Default.args,
  multiple: true,
};
