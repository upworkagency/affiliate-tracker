"use client"
import React, { useState } from 'react';
import { type Redirects, type Generated } from '../../node_modules/kysely-codegen/dist/db'

interface TableProps {
  res: Redirects[];
}
type ColumnType<S, I, U> = any;

type Extract<T> = T extends Generated<infer U> ? U : never;

type IdType = Extract<Redirects["id"]>;
type DateType = Extract<Redirects["redirect_timestamp"]>;
// type IdType<T> = T extends ColumnType<infer S, any, any> ? S : never;
const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    const formattedDate = new Date(timestamp).toLocaleString('en-us', { 
      weekday: "long", 
      year: "numeric", 
      month: "short", 
      day: "numeric", 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZoneName: 'short'
    });
    return formattedDate.replace(/\u202F/g, ' ');
  }
  
export const EditableTable: React.FC<TableProps> = ({ res }) => {
  const [filters, setFilters] = useState<Partial<Redirects>>({
    platform: "",
    redirect_timestamp: "" as any,
    booked_timestamp: "" as any
});

    const [lockedRows, setLockedRows] = useState<Record<number, boolean>>(
        res.reduce<Record<number, boolean>>(
            (acc, redirect) => {
              acc[redirect.id as unknown as number] = true;
              return acc;
            }, 
            {}
        )
    );
    const [data, setData] = useState<Redirects[]>(res);
// Pagination state variables


// Change page
const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const toggleLock = (id: number) => {
    setLockedRows(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };
  const updateRow = (id: number, updatedData: Partial<Redirects>) => {
    setData(prevData => 
      prevData.map(row => 
        row.id as unknown as number === id ? { ...row, ...updatedData } : row
      )
    );
  };
  // This can contain logic to save the changes, if any. For now, just re-locking the row.
  const saveChanges = (id: number) => {
    toggleLock(id);
    updateRow(id, { platform: "New Platform" });
  };


// Helper function to get unique values for filtering
const getUniqueValues = (key: keyof Redirects) => Array.from(new Set(res.map(redirect => redirect[key])));

const filteredRes = res.filter(redirect => {
    return (Object.keys(filters) as Array<keyof Redirects>).every(key => {
        if (filters[key] === undefined || filters[key] === "") return true;
        return redirect[key]?.toString().includes(filters[key]?.toString() || "");
    });
});
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;  // You can adjust this value as needed

// Pagination logic
const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;
const currentRows = filteredRes.slice(indexOfFirstRow, indexOfLastRow);
  return (
    <div>
      <table className="min-w-full">
      <thead className="text-gray-50">
        <tr>
        <th className='bg-none text-gray-50'>
            <input
                className='bg-transparent h-10 w-full outline-none'
                placeholder="Platform"
                value={filters.platform}
                onChange={e => setFilters(prev => ({ ...prev, platform: e.target.value }))}
            />
        </th>
        <th className=''>
            <input
                className='bg-transparent h-10 w-full outline-none'
                placeholder="Timestamp"
                value={filters.redirect_timestamp as unknown as string}
                onChange={e => setFilters((prev: Partial<Redirects>): Partial<Redirects> => ({ ...prev, redirect_timestamp: e.target.value as any }))}
                />
        </th>
        <th >
            <input
                className=' bg-transparent h-10 w-full outline-none'
                placeholder="Booked"
                value={filters.booked_timestamp  as unknown as string}
                onChange={e => setFilters(prev => ({ ...prev, booked_timestamp: e.target.value as any }))}
            />
        </th>
        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">CLOSED</th>
        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">Actions</th>
        </tr>
       
      </thead>
      <tbody>
        {currentRows.map(redirect => (
          <tr key={redirect.id.toString()}>
            <td className="px-3 py-2 whitespace-no-wrap border-b border-gray-300 text-white text-left">
              {redirect.platform}
            </td>
            <td className="px-3 py-2 whitespace-no-wrap border-b border-gray-300 text-white text-left w-full">
              {redirect.calendly_event_id ? formatDate(redirect.redirect_timestamp as any) : 'N/A'}
            </td>
            <td className="px-3 py-2 whitespace-no-wrap border-b border-gray-300 text-white text-left w-full">
              {redirect.calendly_event_id ? "BOOKED" : 'N/A'}
            </td>
            <td className="px-3 py-2 whitespace-no-wrap border-b border-gray-300 text-white text-left w-full">
              {redirect.id && (
                lockedRows[redirect.id as unknown as number] ? "Pending" : (
                  <select defaultValue="Pending">
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
                  </select>
                )
              )}
            </td>
            <td className="py-1 whitespace-no-wrap border-b border-gray-300 text-white">
              {lockedRows[redirect.id as unknown as number] ? (
                <button onClick={() => toggleLock(redirect.id as unknown as number)}>Unlock to Edit</button>
              ) : (
                <button onClick={() => saveChanges(redirect.id as unknown as number)}>Save and Re-lock</button>
              )}
            </td>
          </tr>
        ))}
</tbody>

    </table>
      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Prev
        </button>
        {Array.from({ length: Math.ceil(filteredRes.length / rowsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredRes.length / rowsPerPage)))} disabled={currentPage === Math.ceil(filteredRes.length / rowsPerPage)}>
          Next
        </button>
        <button onClick={() => setCurrentPage(Math.ceil(filteredRes.length / rowsPerPage))} disabled={currentPage === Math.ceil(filteredRes.length / rowsPerPage)}>
          Last
        </button>
      </div>
    </div>
    
  );
};
