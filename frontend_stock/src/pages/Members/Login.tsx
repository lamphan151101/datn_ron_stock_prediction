import React, { FC, ReactNode, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../../layouts/MainLayout';
import Box from '../../components/Common/Box';
import FormInput from '../../components/FormInput/FormInput';
import FormButton from '../../components/FormInput/FormButton';
import httpClient from '../../httpClient';
import {useLoginUserMutation} from "../../services/authApi"
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../app/hooks';
import { setUser } from '../../features/authSlice';

interface FormValues {
  userName: string;
  password: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
    // const currentUser = useSelector((state: any) => state.auth.login.currentUser);
    const [
        loginUser,
        {
            data: loginData,
            isSuccess: isLoginSuccess,
            isError: isLoginError,
            error: loginError
        },
    ] = useLoginUserMutation();

  const [formValues, setFormValues] = useState<FormValues>({
    userName: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (formValues.userName && formValues.password) {
          await loginUser({email: formValues.userName, password: formValues.password})
      }
      else {
          toast.error("please fill all fields")
      }
  };
  console.log(isLoginSuccess)
    useEffect(() => {
        if (isLoginSuccess) {
            toast.success("User Login Successfully");
            dispatch(setUser({name: loginData.email}))
            navigate('/MarketScreen');
        }
    }, [isLoginSuccess])
    console.log(loginError, 'loginError')
  return (
    <MainLayout>
      <div className='flex flex-center full-height'>
        <div className='login no-select'>
          <Box>
            <div className='box-vertical-padding box-horizontal-padding'>
              <div>
                <div className='form-logo center'>
                  <img src='/images/logo.png' alt='Crypto Exchange' draggable='false' />
                </div>
                <h1 className='form-title center'>Member login</h1>
                <p className='form-desc center'>
                  Please in your browser's address bar.
                  <strong>https://pro.cryptoexchange.com</strong> Make sure you have typed it.
                </p>
                <form className='form' onSubmit={handleSubmit} noValidate>
                  <div className='form-elements'>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='userName'>Your User Name</label>
                        <FormInput
                          type='text'
                          name='userName'
                          value={formValues.userName}
                          placeholder='Enter your userName'
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='full-width'>
                        <label htmlFor='password'>Your password</label>
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
                      <div className='full-width right'>
                        <Link to='/members/forgot-password'>I forgot my password</Link>
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='buttons'>
                        <FormButton type='submit' text='Log in' onClick={handleSubmit} />
                      </div>
                    </div>
                    <div className='form-line'>
                      <div className='center'>
                        <p>
                          If you don't have an account <Link to='/Register'>New account</Link>{' '}
                          Create.
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

export default Login;
