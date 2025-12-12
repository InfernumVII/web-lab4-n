import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../store/authThunks';
import { setTheme, getAvailableThemes } from '../store/slices/themeSlice';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  const onLogoutClick = () => {
    dispatch(handleLogout());
    navigate('/login');
  };

  const handleThemeSelect = (selectedTheme) => {
    dispatch(setTheme({ theme: selectedTheme }));
    setShowThemeDialog(false);
  };

  const availableThemes = getAvailableThemes();


  const rightTemplate = (
    <div className="flex align-items-center gap-2">
      <span className="font-medium mr-2 text-color hidden md:block">
         <i className="pi pi-user mr-2"></i>
         {user?.username}
      </span>
      <Button
        icon="pi pi-palette"
        rounded
        text
        severity="secondary"
        onClick={() => setShowThemeDialog(true)}
        tooltip="Change Theme"
      />
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        onClick={onLogoutClick}
        severity="danger"
        text
      />
    </div>
  );

  return (
    <>
      <Menubar 
        model={[]} 
        end={rightTemplate} 
        className="border-none shadow-2 surface-overlay border-noround" 
      />
      
      <Dialog 
        visible={showThemeDialog} 
        onHide={() => setShowThemeDialog(false)} 
        header="Select Theme"
        modal
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
      >
        <div className="grid">
          {availableThemes.map((t) => (
            <div key={t} className="col-12 md:col-6 lg:col-4 p-2">
              <Button
                label={t.replace('lara-', '').replace('-', ' ').toUpperCase()}
                onClick={() => handleThemeSelect(t)}
                className="w-full"
                severity={theme === t ? 'success' : 'secondary'}
                outlined={theme !== t}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default Header;