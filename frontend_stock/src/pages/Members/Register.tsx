import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MainLayout from '../../layouts/MainLayout';
import Box from '../../components/Common/Box';
import FormInput from '../../components/FormInput/FormInput';
import FormButton from '../../components/FormInput/FormButton';
import FormCheckbox from '../../components//FormInput/FormCheckbox';

const SignupScreen = () => {

  const [formValues, setFormValues] = useState({
    email: '',
    phone: '',
    password: '',
    password1: '',
    name: '',
    lastname: '',
    citizenship: false,
    identityType: '',
    identityNumber: '',
    day: '',
    month: '',
    year: '',
    country: '',
    operator: '',
    agreeToPolicies1: false,
    agreeToPolicies2: false,
    agreeToPolicies3: false,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;

    setFormValues({
      ...formValues,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: any) => {
      e.preventDefault();
  };

  return (
    <MainLayout>
      <div className='flex flex-center'>
        <div className='login no-select'>
          <Box>
            <div className='box-vertical-padding box-horizontal-padding'>
              <div>
                <div className='form-logo center'>
                  <img src='/images/logo.png' alt='Crypto Exchange' draggable='false' />
                </div>
                <h1 className='form-title center'>Create an Account</h1>
                <p className='form-desc center'>
                  Please enter the following information. We will send your activation details to your phone number.
                </p>
                <form className='form' onSubmit={handleSubmit} noValidate>
                  <div className='form-elements'>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='email'>Your Email Address</label>
                        <FormInput
                          type='email'
                          name='email'
                          value={formValues.email}
                          placeholder='Enter your email address'
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='password'>Your Password</label>
                        <FormInput
                          type='password'
                          name='password'
                          value={formValues.password}
                          placeholder='Enter your password'
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='password1'>Confirm Your Password</label>
                        <FormInput
                          type='password'
                          name='password1'
                          value={formValues.password1}
                          placeholder='Re-enter your password'
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='name'>Your First Name</label>
                        <FormInput
                          type='text'
                          name='name'
                          value={formValues.name}
                          placeholder='Enter your first name'
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='lastname'>Your Last Name</label>
                        <FormInput
                          type='text'
                          name='lastname'
                          value={formValues.lastname}
                          placeholder='Enter your last name'
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className='form-line'>
                      <div className='full-width'>
                        <FormCheckbox
                          name='citizenship'
                          checked={formValues.citizenship}
                          text='I am a citizen of the Republic of Turkey.'
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>

                    <div className='form-line clearfix'>
                      <div className='half-width'>
                        <label htmlFor='identityType'>Identity Type</label>
                        <select name='identityType' id='identityType'>
                          <option value='1'>Turkish ID number</option>
                        </select>
                      </div>
                      <div className='half-width'>
                        <label htmlFor='identityNumber'>Identity Number</label>
                        <FormInput
                          type='text'
                          name='identityNumber'
                          value={formValues.identityNumber}
                          placeholder='Enter your identity number'
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className='form-line clearfix'>
                      <div className='three-width'>
                        <label htmlFor='day'>Date of Birth</label>
                        <select name='day' id='day'>
                          <option value='1'>Day</option>
                        </select>
                      </div>
                      <div className='three-width'>
                        <label htmlFor='month'>&nbsp;</label>
                        <select name='month' id='month'>
                          <option value='1'>Month</option>
                        </select>
                      </div>
                      <div className='three-width'>
                        <label htmlFor='year'>&nbsp;</label>
                        <select name='year' id='year'>
                          <option value='1'>Year</option>
                        </select>
                      </div>
                    </div>

                    <div className='form-line clearfix'>
                      <div className='three-width'>
                        <label htmlFor='country'>Phone</label>
                        <select name='country' id='country'>
                          <option value='1'>Country code</option>
                        </select>
                      </div>
                      <div className='three-width'>
                        <label htmlFor='operator'>&nbsp;</label>
                        <select name='operator' id='operator'>
                          <option value='1'>Operator code</option>
                        </select>
                      </div>
                      <div className='three-width'>
                        <label htmlFor='phone'>&nbsp;</label>
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
                      <div className='full-width'>
                        <FormCheckbox
                          name='agreeToPolicies1'
                          checked={formValues.agreeToPolicies1}
                          text='I have read and accepted the Personal Data Protection Law Information Text and the User Agreement.'
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width'>
                        <FormCheckbox
                          name='agreeToPolicies2'
                          checked={formValues.agreeToPolicies2}
                          text="I have read and reviewed the Personal Data Processing and Transfer Information Text within the scope of this text. I consent to the processing and transfer of my personal data."
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width'>
                        <FormCheckbox
                          name='agreeToPolicies3'
                          checked={formValues.agreeToPolicies3}
                          text='I accept receiving commercial electronic messages via email, phone, and electronic communication channels about products and services within the scope of the Personal Data Protection Law Information Text.'
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='buttons'>
                        <FormButton type='submit' text='Create Account' onClick={handleSubmit} />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='center'>
                        <p>
                          Already have an account? <Link to='/'>Log in</Link>.
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

export default SignupScreen;
