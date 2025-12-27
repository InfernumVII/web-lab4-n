import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../store/authThunks';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import LoginHeader from '../components/LoginHeader';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useRef(null);
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(username, password));
    if (result.success) {
      navigate('/main');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }

    const result = await dispatch(register(regUsername, regPassword));

    if (result.success) {
      setShowRegister(false);
      setRegUsername('');
      setRegPassword('');
      setRegConfirm('');
      toast.current.show({
        severity: 'success', 
        summary: 'Registration Successful', 
        detail: 'You can now log in.', 
        life: 3000
      });
    } else {
      setRegError(result.message);
    }
  };

  return (
    <div className="flex flex-column h-screen">
      <Toast ref={toast} />
      
      <LoginHeader />

      <div className="flex-grow-1 flex align-items-center justify-content-center surface-ground">
        <Card className="shadow-4 w-full md:w-30rem">
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                <span className="text-600 font-medium line-height-3">Please enter your details</span>
            </div>

            {error && <Message severity="error" text={error} className="w-full mb-3" />}

            <form onSubmit={handleLogin} className="p-fluid">
              <div className="field mb-3">
                <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                <InputText
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                    placeholder="Username"
                    disabled={loading}
                    required
                />
              </div>

              <div className="field mb-3">
                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    toggleMask
                    feedback={false}
                    className="w-full"
                    inputClassName="w-full"
                    disabled={loading}
                    required
                />
              </div>

              <Button
                label={loading ? 'Signing In...' : 'Sign In'}
                icon="pi pi-user"
                type="submit"
                className="w-full mt-3"
                loading={loading}
              />
            </form>

            <Button 
                label="Create Account" 
                icon="pi pi-user-plus" 
                severity="success" 
                outlined 
                className="w-full mt-4" 
                onClick={() => setShowRegister(true)}
            />
        </Card>
      </div>

      <Dialog 
        header="Create Account" 
        visible={showRegister} 
        style={{ width: '450px' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        onHide={() => setShowRegister(false)}
        modal
        className="p-fluid"
      >
         <form onSubmit={handleRegister}>
            {regError && <Message severity="error" text={regError} className="w-full mb-4" />}
            
            <div className="field">
                <label htmlFor="regUsername">Username</label>
                <InputText 
                    id="regUsername" 
                    value={regUsername} 
                    onChange={(e) => setRegUsername(e.target.value)} 
                    required 
                    autoFocus
                />
            </div>
            
            <div className="field">
                <label htmlFor="regPassword">Password</label>
                <Password 
                    id="regPassword" 
                    value={regPassword} 
                    onChange={(e) => setRegPassword(e.target.value)} 
                    toggleMask
                    required 
                    header={<h6>Pick a password</h6>}
                    footer={<Divider />}
                />
            </div>

            <div className="field">
                <label htmlFor="regConfirm">Confirm Password</label>
                <Password 
                    id="regConfirm" 
                    value={regConfirm} 
                    onChange={(e) => setRegConfirm(e.target.value)} 
                    feedback={false}
                    toggleMask
                    required 
                    className={regPassword && regConfirm && regPassword !== regConfirm ? 'p-invalid' : ''}
                />
                {regPassword && regConfirm && regPassword !== regConfirm && 
                    <small className="p-error block mt-2">Passwords do not match.</small>
                }
            </div>

            <div className="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border">
                <Button label="Cancel" icon="pi pi-times" type="button" severity="secondary" onClick={() => setShowRegister(false)} />
                <Button label="Register" icon="pi pi-check" type="submit" loading={loading} />
            </div>
         </form>
      </Dialog>
    </div>
  );
};

export default LoginPage;