import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoints } from '../store/slices/pointSlice';
import Header from '../components/Header';
import Graph from '../components/Graph';
import PointForm from '../components/PointForm';
import ResultsTable from '../components/ResultsTable';

const MainPage = () => {
  const dispatch = useDispatch(); //TODO узнать

  useEffect(() => {
    dispatch(fetchPoints());
  });

  return (
    <div className="min-h-screen surface-ground flex flex-column">
      <Header />
      
      <div className="flex-grow-1 p-3 md:p-5">
        <div className="grid">
            <div className="col-12 lg:col-5 xl:col-4">
                <div className="flex flex-column gap-4">
                    <Graph />
                </div>
            </div>

            <div className="col-12 lg:col-7 xl:col-4">
                 <PointForm />
            </div>

             <div className="col-12 xl:col-4">
                <ResultsTable />
            </div>
            
        </div>

      </div>
    </div>
  );
};

export default MainPage;