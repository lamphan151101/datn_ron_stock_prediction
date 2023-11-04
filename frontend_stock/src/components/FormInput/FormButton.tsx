import React, { FC, MouseEvent, memo } from 'react';
export {};
interface FormButtonProps {
  type: 'submit' | 'button';
  text: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const FormButton: FC<FormButtonProps> = memo(({ type, text, onClick }) => (
  <button
    type={type}
    className='button button-purple button-medium'
    onClick={onClick}
  >
    {text}
  </button>
));

export default FormButton;
