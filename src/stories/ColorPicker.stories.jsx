import React from "react";
import { useArgs } from "@storybook/client-api";

import ColorPicker from "../components/UI/fields/ColorPicker";

export default {
  title: "ForwardSlash/Fields/Color Picker",
  component: ColorPicker,
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
  return <ColorPicker onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "red",
  label: "label",
  options: [
    "red",
    "gold",
    "orange",
    "green",
    "turquoise",
    "blue",
    "pink",
    "purple",
    "grey",
    "black",
  ],
  colors: [
    "#D20E1E",
    "#E19D00",
    "#E05307",
    "#0E6D0E",
    "#009FAA",
    "#0067C0",
    "#CD007B",
    "#4F4DCE",
    "#586579",
    "#000000",
  ],
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
