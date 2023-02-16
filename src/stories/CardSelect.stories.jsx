import React from "react";
import { useArgs } from "@storybook/client-api";

import CardSelect from "../components/UI/fields/CardSelect";

export default {
  title: "ForwardSlash/Fields/Card Select",
  component: CardSelect,
  decorators: []
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <CardSelect onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "public",
  label: "Permissions",
  values: ["public", "private"],
  options: ["Public", "Private"],
  descriptions: [
    "Make this project accessible to others via its unique permalink.",
    "Make this project not visible to anyone other than you.",
  ],
  readOnly: false,
  disabled: false,
  row: false,
  centeredText: false,
};

export const Row = Template.bind({});
Row.args = {
  ...Default.args,
  row: true,
};

export const CenteredText = Template.bind({});
CenteredText.args = {
  ...Default.args,
  centeredText: true,
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
