import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setCurrentR } from '../store/slices/pointSlice';
import { Slider } from 'primereact/slider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';

const PointForm = () => {
  const dispatch = useDispatch();
  const { loading, error, currentR } = useSelector((state) => state.points);

  const [x, setX] = useState(0);
  const [y, setY] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleRChange = (e) => {
    dispatch(setCurrentR(e.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!/^-?\d+(\.\d+)?$/.test(y)) {
        setLocalError("Y must be a number");
        return;
    }
    const yVal = parseFloat(y);
    if (yVal < -5 || yVal > 3) {
        setLocalError("Y must be between -5 and 3");
        return;
    }

    if (currentR <= 0) {
        setLocalError("Radius must be positive");
        return;
    }
    if (currentR > 3) {
        setLocalError("Radius must be <= 3");
        return;
    }

    dispatch(addPoint({ x, y: yVal, r: currentR }));
  };

  return (
    <Card className="shadow-2 surface-card h-full">
      <h3 className="text-center mt-0">Coordinates</h3>
      
      <form onSubmit={handleSubmit} className="p-fluid">
        {(error || localError) && (
             <Message severity="error" text={localError || error} className="w-full mb-3" />
        )}

        <div className="field mb-5">
            <label className="font-bold block mb-2">X: {x}</label>
            <Slider 
                value={x} 
                onChange={(e) => setX(e.value)} 
                min={-5} 
                max={3} 
                step={1} 
            />
            <div className="flex justify-content-between text-xs text-500 mt-1">
                <span>-5</span><span>3</span>
            </div>
        </div>

        <div className="field mb-4">
            <label htmlFor="y-input" className="font-bold block mb-2">Y (-5 ... 3)</label>
            <InputText 
                id="y-input" 
                value={y} 
                onChange={(e) => setY(e.target.value)} 
                placeholder="Enter Y coordinate"
                keyfilter={/^-?[\d.]*$/} 
                className={localError && localError.includes('Y') ? 'p-invalid' : ''}
            />
        </div>

        <div className="field mb-5">
            <label className="font-bold block mb-2">R: {currentR}</label>
            <Slider 
                value={currentR} 
                onChange={handleRChange} 
                min={-5} 
                max={3} 
                step={0.5}
                className={currentR <= 0 ? 'p-slider-danger' : ''} 
            />
             <div className="flex justify-content-between text-xs text-500 mt-1">
                <span>-5</span><span>3</span>
            </div>
             {currentR <= 0 && <small className="text-red-500">Radius must be positive!</small>}
        </div>

        <Button 
            label={loading ? 'Checking...' : 'Check Point'} 
            icon="pi pi-check" 
            loading={loading}
            disabled={currentR <= 0}
            type="submit" 
        />
      </form>
    </Card>
  );
};

export default PointForm;