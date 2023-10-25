import React from 'react';

type Props = {
  name: string;
  age: number;
  employees: string[];
};

const Manager: React.FC<Props> = ({ name, age, employees }) => {
  return (
    <div>
      <h1>Welcome to the Manager page!</h1>
      <p>My name is {name} and I am {age} years old.</p>
      <p>My employees are:</p>
      <ul>
        {employees.map((employee, index) => (
          <li key={index}>{employee}</li>
        ))}
      </ul>
    </div>
  );
};

export default Manager;
