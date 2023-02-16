import React from "react";

import Accordion from "../components/UI/Accordion";

export default {
  title: "ForwardSlash/Accordion",
  component: Accordion,
  decorators: []
};

const Template = (args) => <Accordion {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Lorem ipsum dolor sit amet",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus sit amet lorem a mattis. Donec sit amet velit commodo, ultrices massa ut, tristique eros. Quisque quis sem varius, efficitur ante feugiat, feugiat sem. Nullam a ullamcorper ipsum, eu mollis magna. Vivamus mattis, mi id bibendum interdum, urna enim tristique arcu, sit amet luctus dui libero eget ipsum. Pellentesque sit amet ipsum ex. Cras tempus neque ut erat fermentum accumsan. Donec ac nulla efficitur lorem aliquet consequat nec vitae risus. Pellentesque eget imperdiet sem, eget sodales erat. Vivamus finibus tincidunt dolor, ut consequat eros condimentum non. Phasellus nisi orci, molestie eget diam dignissim, tincidunt aliquet ante.",
  contained: false,
};

export const Contained = Template.bind({});
Contained.args = {
  ...Default.args,
  contained: true,
};
