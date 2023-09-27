import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper()

const tableInstance = useReactTable({
         columns,
         data,
         getCoreRowModel: getCoreRowModel(),
         getPaginationRowModel: getPaginationRowModel(),
         getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!
         // etc.
       });