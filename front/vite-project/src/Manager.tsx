import React from 'react';

type Props = {
  name: string;
  age: number;
  employees: string[];
};

const Manager: React.FC<Props> = () => {
  return (
    <div>
      <h1>Welcome to the Manager page!</h1>
      <p>My name is and I am  years old.</p>
      <p>My employees are:</p>
      <ul>
      </ul>
    </div>
  );
};

export default Manager;
