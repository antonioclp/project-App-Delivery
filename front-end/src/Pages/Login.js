import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiCallLogin from '../Helpers/loginApiCall';
import apiPostGeneric from '../Helpers/apiPostGeneric';

export default function Login() {
  const [enableButton, setButton] = useState(true);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  // const [isLoggied, setIsLoggied] = useState(false);
  const [failedLogin, setfailedlogin] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const verifyEmail = '@';
    const verifyEmailDot = '.com';
    const minPassword = 6;
    const validEmail = email.includes(verifyEmail) && email.includes(verifyEmailDot);
    const validPassword = password.length >= minPassword;
    const finalValidation = validEmail && validPassword;
    if (password.length < minPassword) {
      setButton(true);
    }
    if (finalValidation) {
      setButton(false);
    }
    const validateUsers = async () => {
      if (JSON.parse(localStorage.getItem('user')) !== null) {
        const { token } = JSON.parse(localStorage.getItem('user'));
        const response = await apiPostGeneric('validateUsers', { token });
        if (response) {
          history.push('/customer/products');
        }
        if (!response) {
          history.push('/login');
        }
      }
    };
    validateUsers();
  }, [email, password, history]);

  const enterApp = async () => {
    const response = await apiCallLogin({ email, password });
    const { id, name, role, token } = response;
    if (!token) {
      setfailedlogin(true);
    }
    if (token) {
      localStorage.setItem('user', JSON.stringify(
        {
          id,
          email: response.email,
          name,
          role,
          token },
      ));
      switch (role) {
      case 'administrator': history.push('/admin/manage');
        break;
      case 'customer': history.push('/customer/products');
        break;
      case 'seller': history.push('/seller/orders');
        break;
      default: history.push('/');
      }
    }
  };

  const register = () => {
    history.push('/register');
  };
  return (
    <div>
      <form className="Login">
        <label htmlFor="email-input">
          email
          <input
            type="email"
            id="email-input"
            data-testid="common_login__input-email"
            value={ email }
            onChange={ (e) => setemail(e.target.value) }
          />
        </label>
        <label htmlFor="pssword-input">
          password
          <input
            id="pssword-input"
            type="password"
            data-testid="common_login__input-password"
            value={ password }
            onChange={ (e) => setpassword(e.target.value) }
          />
        </label>
        <br />
        <br />
        <button
          type="button"
          data-testid="common_login__button-login"
          onClick={ () => enterApp() }
          disabled={ enableButton }
        >
          Login
        </button>
        <button
          type="button"
          data-testid="common_login__button-register"
          onClick={ () => register() }
        >
          cadastro
        </button>
        {
          (failedLogin)
            ? (
              <p data-testid="common_login__element-invalid-email">
                {
                  `O endereço de e-mail ou a senha não estão corretos.
                    Por favor, tente novamente.`
                }
              </p>
            )
            : null
        }
      </form>
    </div>
  );
}
