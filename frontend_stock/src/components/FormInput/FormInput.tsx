import React, { FC, memo, ChangeEvent } from 'react';
export {};
interface FormInputProps {
  type: string;
  name: string;
  value?: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<FormInputProps> = memo(({ type, name, value = '', placeholder, onChange }) => (
  <input
    id={name}
    name={name}
    type={type}
    value={value}
    autoComplete='off'
    onChange={onChange}
    placeholder={placeholder}
  />
));

export default FormInput;
