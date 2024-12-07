import type { Meta, StoryObj } from "@storybook/react";

import StreamerSettingsPage from "./StreamerSettingsPage";

const meta: Meta<typeof StreamerSettingsPage> = {
  component: StreamerSettingsPage,
};

export default meta;

type Story = StoryObj<typeof StreamerSettingsPage>;

export const Primary: Story = {};
