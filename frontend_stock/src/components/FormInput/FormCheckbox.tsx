import React, { memo, ChangeEvent } from 'react';

interface FormCheckboxProps {
  name: string;
  text: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ name, text, onChange, checked }) => (
  <label className="checkbox-container">
    {text}
    <input
      type="checkbox"
      id={name}
      name={name}
      value="0"
      defaultChecked={checked}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)}
    />
    <span className="checkmark" />
  </label>
);

export default memo(FormCheckbox);
