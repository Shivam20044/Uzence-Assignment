import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import InputField, { InputFieldProps } from '../components/InputField/InputField';

export default {
  title: 'Components/InputField',
  component: InputField,
  argTypes: {
    variant: { control: { type: 'select', options: ['filled', 'outlined', 'ghost'] } },
    size: { control: { type: 'select', options: ['sm', 'md', 'lg'] } },
  },
} as Meta<typeof InputField>;

const Template: StoryFn<InputFieldProps> = (args) => {
  const [value, setValue] = useState(args.value ?? '');
  return (
    <InputField
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
      onEnter={() => alert(`Entered: ${value}`)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Email Address',
  placeholder: 'Enter your email',
  helperText: "We'll never share your email.",
};

export const VariantsAndSizes: StoryFn<InputFieldProps> = () => (
  <div className="space-y-4">
    <div>
      <h4 className="mb-2">Filled / Outlined / Ghost</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Filled" placeholder="Filled" variant="filled" />
        <InputField label="Outlined" placeholder="Outlined" variant="outlined" />
        <InputField label="Ghost" placeholder="Ghost" variant="ghost" />
      </div>
    </div>

    <div>
      <h4 className="mb-2">Sizes</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Small" placeholder="Small" size="sm" />
        <InputField label="Medium" placeholder="Medium" size="md" />
        <InputField label="Large" placeholder="Large" size="lg" />
      </div>
    </div>

    <div>
      <h4 className="mb-2">Password Toggle</h4>
      <InputField label="Password" type="password" placeholder="Enter password" showPasswordToggle />
    </div>
  </div>
);

export const WithClearButton = Template.bind({});
WithClearButton.args = {
  label: 'Search',
  placeholder: 'Type to search...',
  showClearButton: true,
};

export const Loading = Template.bind({});
Loading.args = {
  label: 'Loading input',
  placeholder: 'Loading...',
  loading: true,
};
