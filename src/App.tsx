import React, { useState } from 'react';
import UserForm from './Components/UserForm';
import UserTable from './Components/UserTable';

const App: React.FC = () => {
  const [isUserAdded, setIsUserAdded] = useState(false);

  const handleUserAdded = () => {
    setIsUserAdded((prev) => !prev); // Trigger the table to refresh
  };

  return (
    <div>
      <h1>User Management</h1>
      <UserForm onUserAdded={handleUserAdded} />
      <UserTable />
    </div>
  );
};

export default App;
