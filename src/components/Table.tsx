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
export const EditableTable: React.FC<TableProps> = ({ res }) => {


    console.log("RES in EditableTable: ", res)
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

    console.log("LOCKED ROWS: ", lockedRows)

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


  const [filters, setFilters] = useState<Partial<Redirects>>({
    platform: "",
    redirect_timestamp: "" as any,
    booked_timestamp: "" as any
});
// Helper function to get unique values for filtering
const getUniqueValues = (key: keyof Redirects) => Array.from(new Set(res.map(redirect => redirect[key])));

const filteredRes = res.filter(redirect => {
    return (Object.keys(filters) as Array<keyof Redirects>).every(key => {
        if (filters[key] === undefined || filters[key] === "") return true;
        return redirect[key]?.toString().includes(filters[key]?.toString() || "");
    });
});
console.log("filtered: ", filteredRes)

  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-200 ">
        <tr>
        <th className=''>
            <input
                className='h-10 w-full outline-none'
                placeholder="Filter by Platform"
                value={filters.platform}
                onChange={e => setFilters(prev => ({ ...prev, platform: e.target.value }))}
            />
        </th>
        <th className=''>
            <input
                className='h-10 w-full outline-none'
                placeholder="Filter by Timestamp"
                value={filters.redirect_timestamp as unknown as string}
                onChange={e => setFilters((prev: Partial<Redirects>): Partial<Redirects> => ({ ...prev, redirect_timestamp: e.target.value as any }))}
                />
        </th>
        <th >
            <input
                className='h-10 w-full outline-none'
                placeholder="Filter by Booked"
                value={filters.booked_timestamp  as unknown as string}
                onChange={e => setFilters(prev => ({ ...prev, booked_timestamp: e.target.value as any }))}
            />
        </th>
        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">CLOSED</th> {/* New Header */}
        <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">Actions</th>
        </tr>
       
      </thead>
      <tbody>
        {filteredRes.map(redirect => (
          <tr key={redirect.id.toString()}>
            {/* ... other cells ... */}
           
          <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">{redirect.platform}</td>
          <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">
            {
              new Date(redirect.redirect_timestamp?.toString()).toLocaleString('en-us', { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "short", 
                  day: "numeric", 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  timeZoneName: 'short'
              })
            }
          </td>
          <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">
                {redirect.booked_timestamp 
                    ? new Date(redirect.booked_timestamp as any).toLocaleString('en-us', { 
                        weekday: "long", 
                        year: "numeric", 
                        month: "short", 
                        day: "numeric", 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        timeZoneName: 'short'
                    })
                    : 'N/A'}
            </td>

          <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">
              {
                redirect.id && (
                    lockedRows[redirect.id as unknown as number] ? (
                        "Pending"
                    ) : (
                        <select defaultValue="Pending">
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                        </select>
                    )
                )
              }
            </td>
            <td className=" py-1 whitespace-no-wrap border-b border-gray-300">
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
  );
};
