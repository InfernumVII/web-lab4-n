import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { setTheme, getAvailableThemes } from '../store/slices/themeSlice';

const LoginHeader = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  const handleThemeSelect = (selectedTheme) => {
    dispatch(setTheme({ theme: selectedTheme }));
    setShowThemeDialog(false);
  };

  const availableThemes = getAvailableThemes();


  const startTemplate = (
      <div className="flex flex-column sm:flex-row sm:align-items-center gap-1 sm:gap-3 text-color select-none cursor-default">
          <span className="font-bold text-lg">Швецов Егор Максимович</span>
          
          <span className="hidden sm:block text-400">|</span>
          
          <div className="flex align-items-center gap-1">
              <span className="text-color-secondary text-sm">Группа:</span>
              <span className="font-medium">P3206</span>
          </div>
  
          <span className="hidden sm:block text-400">|</span>
  
          <div className="flex align-items-center gap-1">
              <span className="text-color-secondary text-sm">Вариант:</span>
              <span className="font-medium">3358</span>
          </div>
      </div>
    );

  const rightTemplate = (
    <div className="flex align-items-center gap-2">
      <span className="font-semibold text-color-secondary mr-2">Theme:</span>
      <Button
        icon="pi pi-palette"
        rounded
        text
        onClick={() => setShowThemeDialog(true)}
        tooltip="Change Theme"
      />
    </div>
  );

  return (
    <>
      <Menubar 
            model={[]} 
            start={startTemplate}
            end={rightTemplate} 
            className="border-none shadow-2 surface-overlay border-noround p-3" 
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
            <div key={t} className="col-6 md:col-4 p-2">
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

export default LoginHeader;