import React from "react";
import { useArgs } from "@storybook/client-api";

import SidePanel from "../components/UI/SidePanel";

export default {
  title: "ForwardSlash/Side Panel",
  component: SidePanel,
  decorators: [],
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleClose = () => updateArgs({ open: false });
  return (
    <SidePanel
      onClose={handleClose}
      header={
        <center>
          <b>Can you read this?!</b>
        </center>
      }
      footer={
        <center>
          <b>I hope you enjoyed it!</b>
        </center>
      }
      {...args}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
        porttitor risus ligula, eu tincidunt quam sollicitudin ut. In
        condimentum rhoncus dolor, vel dictum justo. Donec id dictum ligula.
        Pellentesque posuere justo cursus nisl tincidunt, ac vestibulum urna
        gravida. Proin eleifend venenatis elit sit amet dignissim. Cras ultrices
        posuere neque, feugiat fringilla mauris porttitor ut. Nam tincidunt
        ultrices efficitur. Donec vitae lobortis purus. Nunc a nisi rutrum,
        lacinia nisl eget, ultricies nunc. Aenean eget arcu neque. Phasellus
        finibus ipsum non magna egestas, eu fringilla enim placerat. Ut a mollis
        mi. Vestibulum dapibus rhoncus est, vitae condimentum neque finibus ac.
        Ut lobortis imperdiet nunc quis laoreet.
        <br />
        <br />
        Mauris ex nulla, faucibus et dapibus non, rutrum vitae magna. Proin et
        tincidunt sem. Donec nec dui nunc. Vivamus non sagittis ipsum, tempus
        pretium orci. Duis viverra libero iaculis, accumsan arcu sit amet,
        iaculis mauris. Proin fringilla cursus nisl et placerat. Ut sit amet
        luctus sapien, id vestibulum nunc. Proin ornare euismod quam ac maximus.
        <br />
        <br />
        Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
        inceptos himenaeos. Donec dignissim interdum justo at accumsan. Aliquam
        sapien tortor, semper feugiat urna sit amet, finibus volutpat ex.
        Pellentesque a porta sapien. Donec dictum, lacus in elementum tincidunt,
        nisi ante bibendum urna, tempor tincidunt lectus erat ut nisl. Sed
        tincidunt, sem ac consequat commodo, dolor neque tempor augue, dignissim
        varius odio mauris et lacus. Phasellus pharetra volutpat enim
        condimentum tincidunt. Aliquam a felis enim. Sed vitae varius sapien.
        Duis dignissim erat lectus, quis laoreet tortor gravida nec. Vestibulum
        pharetra turpis vel leo dapibus facilisis. Vestibulum ante ipsum primis
        in faucibus orci luctus et ultrices posuere cubilia curae; Proin
        interdum ante sapien, eu dapibus nisi mollis ac. Proin feugiat mauris et
        lorem molestie, sed commodo odio ornare. In id lacus maximus, interdum
        leo non, rutrum metus. Aliquam eget dignissim elit.
        <br />
        <br />
        Donec in pretium ipsum. Nulla facilisi. Phasellus lobortis rutrum metus
        ac cursus. In aliquet ornare semper. Mauris sollicitudin mauris ac
        ligula posuere, ultrices venenatis tellus sollicitudin. Integer ut arcu
        at neque ornare dignissim quis eget tellus. Nam dolor augue, feugiat a
        sem non, porta pretium lectus. Curabitur imperdiet sit amet libero
        sagittis porttitor. Sed non diam ac leo ultricies pretium. Pellentesque
        condimentum erat eu nisl mollis pellentesque. Sed dui nibh, placerat nec
        tellus a, pharetra suscipit tellus. Cras elit felis, rutrum at consequat
        suscipit, interdum ac lacus. Quisque molestie semper erat, quis commodo
        purus malesuada eget. Duis eu odio arcu. Vestibulum pulvinar risus sit
        amet scelerisque auctor. Morbi eu ex sit amet enim pretium vulputate.
        <br />
        <br />
        In eu lacus enim. Cras turpis lectus, venenatis ac dignissim ac, tempor
        eu libero. Donec in pretium nunc. Duis dictum tempor bibendum.
        Pellentesque at sagittis tortor. Nullam vitae maximus arcu. Vivamus
        commodo cursus risus, ut mattis felis dignissim non. Nunc arcu tortor,
        dapibus eget quam at, posuere porta risus. Praesent vitae eleifend
        augue. Duis eget aliquet lorem, sit amet aliquet nunc. Donec accumsan,
        velit non sagittis mattis, diam felis efficitur tellus, in elementum
        enim nisi sit amet sem. Etiam id iaculis lectus.
      </p>
    </SidePanel>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Lorem Ipsum",
  open: true,
  submitLabel: "",
  submitDisabled: false,
  disabled: false,
};

export const Closed = Template.bind({});
Closed.args = {
  ...Default.args,
  open: false,
};

export const Submission = Template.bind({});
Submission.args = {
  ...Default.args,
  submitLabel: "All Done",
};

export const SubmissionDisabled = Template.bind({});
SubmissionDisabled.args = {
  ...Submission.args,
  submitDisabled: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
