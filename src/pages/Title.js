import { useState, useContext } from "react";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Stack,
  Button,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

import { AiFillDelete } from "react-icons/ai";
import { BsFilter, BsSearch } from "react-icons/bs";
import { visuallyHidden } from "@mui/utils";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TitleContext } from "./../context/titleContext";
import { AuthContext } from "./../context/authContext";
import ComponentHeader from "../components/ComponentHeader";
import { toast } from "react-toastify";
import { useWallet } from "../context/web3Context";

const alertStyle = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    label: "TITLE",
  },
  {
    id: "content",
    label: "CONTENT",
  },

  {
    id: "verified",
    label: "VERIFIED",
  },
  {
    id: "status",
    label: "STATUS",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <OutlinedInput
            placeholder="Search here..."
            startAdornment={
              <InputAdornment position="start">
                <BsSearch />
              </InputAdornment>
            }
          ></OutlinedInput>
          <Box sx={{ flexGrow: 1 }}></Box>
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <AiFillDelete />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton sx={{ px: 2 }}>
            <BsFilter />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const Title = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { walletAddress } = useWallet();
  const [openModal, setOpenModal] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");

  const { titles, addTitle } = useContext(TitleContext);
  const { user } = useContext(AuthContext);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = titles.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - titles.length) : 0;

  const addTitleOnUser = async () => {
    if (currentTitle === "") {
      toast.error("Please Enter Title name", {
        ...alertStyle,
      });
      return;
    }
    try {
      const response = await addTitle(currentTitle);
      toast.success("Successfully added title!", {
        ...alertStyle,
      });
      setOpenModal(false);
    } catch (e) {
      toast.error("An error occured", {
        ...alertStyle,
      });
      setOpenModal(false);
    }
  };

  // modal part

  const handleClickModalOpen = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      {walletAddress ? (
        <Box sx={{ width: "100%" }}>
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Add Title</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To subscribe to this website, please enter your title here. We
                will send updates immediately...
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="title"
                name="title"
                label="Add title"
                fullWidth
                variant="standard"
                value={currentTitle}
                onChange={(event) => {
                  setCurrentTitle(event.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="contained"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="contained"
                onClick={addTitleOnUser}
              >
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <ComponentHeader title="Title" variant="h5" />
            <Button
              variant="contained"
              color="success"
              onClick={handleClickModalOpen}
            >
              Add Title
            </Button>
          </Stack>
          <Paper sx={{ width: "100%", my: 2, py: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={titles.length}
                />
                <TableBody>
                  {stableSort(titles, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.title);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.title)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.title}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {row.title}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>Content for Title</TableCell>
                          <TableCell>Yes</TableCell>
                          <TableCell
                            sx={{
                              color: "#229A16",
                            }}
                          >
                            Active
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={titles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4">
            Sorry, you can read your titles only after connecting your wallet.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
export default Title;
