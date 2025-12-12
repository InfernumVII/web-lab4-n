import { useDispatch, useSelector } from 'react-redux';
import { setPagination } from '../store/slices/pointSlice';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

const ResultsTable = () => {
  const dispatch = useDispatch();
  const { points, loading, pagination } = useSelector((state) => state.points);

  const statusBodyTemplate = (rowData) => {
    return (
        <span className={`px-2 py-1 border-round font-bold text-white ${rowData.hit ? 'bg-green-500' : 'bg-red-500'}`}>
            {rowData.hit ? 'HIT' : 'MISS'}
        </span>
    );
  };

  const dateBodyTemplate = (rowData) => {
      return rowData.checkTime;
  };

  const onPageChange = (event) => {
      dispatch(setPagination({
          first: event.first,
          rows: event.rows
      }));
  };

  return (
    <Card className="shadow-2 surface-card">
        <DataTable 
            value={points} 
            paginator 
            
            first={pagination.first} 
            rows={pagination.rows}
            onPage={onPageChange}

            rowsPerPageOptions={[5, 10, 20]}
            loading={loading}
            emptyMessage="No results found."
            responsiveLayout="scroll"
            size="small"
            
        >
            <Column field="x" header="X" style={{ width: '15%' }}/>
            <Column field="y" header="Y" style={{ width: '15%' }}/>
            <Column field="r" header="R" style={{ width: '15%' }}/>
            <Column field="checkTime" header="Time" body={dateBodyTemplate} style={{ width: '25%' }}/>
            <Column field="executionTime" header="Exec (µs)" style={{ width: '15%' }}/>
            <Column field="hit" header="Result" body={statusBodyTemplate} style={{ width: '15%' }}/>
        </DataTable>
    </Card>
  );
};

export default ResultsTable;