import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import DataTable, { DataTableProps } from '../components/DataTable/DataTable';
import type { Column } from '../components/DataTable/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default {
  title: 'Components/DataTable',
  component: DataTable,
} as Meta<typeof DataTable>;

const DataTableForUser = DataTable as unknown as React.ComponentType<DataTableProps<User>>;

const Template: StoryFn<DataTableProps<User>> = (args) => <DataTableForUser {...args} />;

const sampleData: User[] = [
  { id: 1, name: 'Shivam Kumar', email: 'shivamkumar23302@gmail.com', role: 'Admin' },
  { id: 2, name: 'Shashank', email: 'shashank1234@gmail.com', role: 'User' },
  { id: 3, name: 'Maurya', email: 'mauryajiii@gmail.com', role: 'User' },
];

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
];

export const Default = Template.bind({});
Default.args = {
  data: sampleData,
  columns,
  selectable: true,
  selectMode: 'multiple',
};
