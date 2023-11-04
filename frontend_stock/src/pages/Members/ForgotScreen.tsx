import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';

import MainLayout from '../../layouts/MainLayout';
import Box from '../../components/Common/Box';
import FormInput from '../../components/FormInput/FormInput';
import FormButton from '../../components/FormInput/FormButton';

interface FormValues {
  phone: string;
}

const ForgotScreen: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    phone: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <MainLayout>
      <div className='flex flex-center full-height'>
        <div className='login no-select'>
          <Box>
            <div className='box-vertical-padding box-horizontal-padding'>
              <div>
                <div className='form-logo center'>
                  <img src='/images/logo.png' alt='Crypto Exchange' draggable={false} />
                </div>
                <h1 className='form-title center'>Password Reset</h1>
                <p className='form-desc center'>
                  Please enter your registered phone number. We will send your password reset information.
                </p>
                <form className='form' onSubmit={handleSubmit} noValidate>
                  <div className='form-elements'>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='phone'>Your Phone Number</label>
                        <FormInput
                          type='text'
                          name='phone'
                          value={formValues.phone}
                          placeholder='Enter your phone number'
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width right'>
                        <Link to='/'>Log in</Link>
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='buttons'>
                        <FormButton type='submit' text='Send' onClick={handleSubmit} />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='center'>
                        <p>
                          Don't have an account? <Link to='/members/signup'>Create a new account</Link>.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotScreen;
