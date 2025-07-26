import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChartContainer from './ChartContainer';
import TableViewIcon from '@mui/icons-material/TableView';

const DataTable = ({ data, title = "Data Table" }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('published');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { id: 'published', label: 'Date', minWidth: 100 },
    { id: 'title', label: 'Title', minWidth: 200 },
    { id: 'sector', label: 'Sector', minWidth: 120 },
    { id: 'topic', label: 'Topic', minWidth: 120 },
    { id: 'region', label: 'Region', minWidth: 100 },
    { id: 'country', label: 'Country', minWidth: 100 },
    { id: 'intensity', label: 'Intensity', minWidth: 80, align: 'center' },
    { id: 'likelihood', label: 'Likelihood', minWidth: 80, align: 'center' },
    { id: 'relevance', label: 'Relevance', minWidth: 80, align: 'center' },
  ];

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === 'published') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredData, orderBy, order]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCellValue = (value, columnId) => {
    if (columnId === 'published') {
      return new Date(value).toLocaleDateString();
    }
    if (columnId === 'title' && value?.length > 50) {
      return value.substring(0, 50) + '...';
    }
    if (['intensity', 'likelihood', 'relevance'].includes(columnId)) {
      return (
        <Chip
          label={value || 0}
          size="small"
          color={value > 3 ? 'primary' : value > 1 ? 'secondary' : 'default'}
          variant="outlined"
        />
      );
    }
    return value || '-';
  };

  return (
    <ChartContainer
      title={title}
      icon={<TableViewIcon />}
    >
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      <TableContainer
        sx={{
          maxHeight: 400,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    fontWeight: 600,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: 'primary.main !important',
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    '& td': {
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {formatCellValue(row[column.id], column.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          '& .MuiTablePagination-toolbar': {
            paddingRight: 2,
          },
        }}
      />

      {filteredData.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No data found matching your search criteria.
          </Typography>
        </Box>
      )}
    </ChartContainer>
  );
};

export default DataTable;