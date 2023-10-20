"use client"
import * as React from 'react';
import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
import { Redirects } from 'kysely-codegen'

export default function RedirectsTable({ rows }: { rows: Redirects[]}) {
    const [lockedRows, setLockedRows] = React.useState<Record<number, boolean>>({});
    const toggleLock = (id: number) => {
        setLockedRows(prevState => ({
          ...prevState,
          [id]: !prevState[id]
        }));
      };
      
      const saveChanges = (id: number) => {
        // Implement the logic to save changes here
        // After saving, you can re-lock the row if needed
        setLockedRows(prevState => ({
          ...prevState,
          [id]: true
        }));
      };
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate.replace(/\u2009/g, ' ').replace(' ', ' '); // Added replacement for the thin space
    }
  return (
    <Root sx={{ maxWidth: '100%', width: '100%' }}>
      <table aria-label="redirects table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Timestamp</th>
            <th>Booked</th>
            <th>Closer</th>
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((redirect) => (
            <tr key={redirect.id.toString()}>
              <td>{redirect.platform}</td>
              <td style={{ width: 160 }} align="right">
              {redirect.redirect_timestamp ? formatDate(new Date(redirect.redirect_timestamp.toString())) : 'N/A'}</td>
              <td style={{ width: 160 }} align="right">
                {redirect.calendly_event_id ? "BOOKED" : 'N/A'}
              </td>
              <td>{redirect.account_id && (
                <h1>{redirect.account_id}</h1>
              )}</td>
            </tr>
          ))}
          {emptyRows > 0 && (
            <tr style={{ height: 41 * emptyRows }}>
              <td colSpan={5} aria-hidden />
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={5}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </Root>
  );
}


const grey = {
  200: '#d0d7de',
  800: '#32383f',
  900: '#24292f',
};

const Root = styled('div')(
  ({ theme }) => `
  table {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    text-align: left;
    padding: 8px;
    text-color: white;
  }

  th {
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  }
  td {
    color: white;
  }
  `,
);

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;