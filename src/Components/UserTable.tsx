import React, { useState, useEffect } from 'react';
import {
  MRT_Table,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  description: string;
  profile_image: string;
  role_name: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const columns: MRT_ColumnDef<User>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'role_name', header: 'Role' },
    {
      accessorKey: 'profile_image',
      header: 'Profile Image',
      Cell: ({ cell }) => (
        <img
          src={cell.getValue<string>()}
          alt="Profile"
          style={{ width: 50, height: 50, borderRadius: '50%' }}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data: users,
    manualPagination: true, // Enable manual pagination if needed
    enableSorting: true,
  });

  return <MRT_Table table={tableInstance} />;

};

export default UserTable;
