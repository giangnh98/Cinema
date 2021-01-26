import React from 'react';
// Import React Table
import ReactTable from 'react-table-6';
import '../../.././../assets/css/react-table.css';
import moment from 'moment';
import _ from 'lodash';
import { Button, Grid, IconButton } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import setAuthHeaders from '../../../../ultils/setAuthToken';
import { showErrors } from '../../../../store/alert/alert.thunk';
import { connect } from 'react-redux';
import UserInfo from '../User/components/UserInfo';
import DialogTicket from '../../../Ticket/DialogTicket';
import ShowtimeInfo from './components/ShowtimeInfo';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConfirmDialog from '../../../ConfirmDialog/ConfirmDialog';

const date = new Date();
date.setHours(0, 0, 0, 0);
class Reservations extends React.Component {
  pageSize = 10;

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered: [],
      sorted: [],
      pages: null,
      page: 0,
      pageSize: 10,
      loading: false,
      dialog: {
        open: false,
        confirm: false,
        openDialog: false,
        id: '',
      },
    };
  }

  fetchTickets = () => {
    fetch(`/api/tickets`, { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          loading: false,
          pages: Math.ceil(data.length / this.state.pageSize),
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.fetchTickets();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.pageSize !== this.state.pageSize) {
      this.fetchTickets();
    }
  }

  componentWillUnmount() {
    this.setState({});
  }

  fetchData = _.debounce((state) => {
    this.setState({
      loading: true,
      pageSize: state.pageSize,
      page: state.page,
    });
    const objectSort = state.sorted[0];
    const id = objectSort ? objectSort.id.toLowerCase() : 'id';
    const sort = objectSort ? objectSort.desc : false;
    const url = `/api/tickets/paginate?pageSize=${state.pageSize}
               &page=${state.page}
               &sortBy=${id}
               &sortType=${sort ? 'descending' : 'ascending'}`;
    fetch(url, { method: 'GET', headers: setAuthHeaders() })
      .then((response) => response.json())
      .then((data) => {
        data.map((row) => {
          row.created = moment(row.created).format('HH:mm a, dddd DD/MM/YYYY');
          row.updated = moment(row.updated).format('HH:mm a, dddd DD/MM/YYYY');
          return row;
        });
        this.setState({
          loading: false,
          data: data,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        this.props.showErrors(error.message, 'error');
      });
  }, 80);

  handleClose = () => {
    this.setState({ dialog: { ...this.state.dialog, open: false } });
  };

  toggleShowtimeDialog = () => {
    this.setState({ dialog: { ...this.state.dialog, openDialog: false } });
  };

  deleteTicket = (ticketId) => {
    this.setState({
      loading: true,
      dialog: { ...this.state.dialog, confirm: false },
    });
    fetch(`/api/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: setAuthHeaders(),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          loading: false,
        });
        if (!data.error) {
          this.props.showErrors('Cancel Ticket Success!', 'success');
          window.location.reload();
        } else if (data.error) {
          this.props.showErrors(data.message, 'error');
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        this.props.showErrors(error.message, 'error');
      });
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            margin: '10px 0',
          }}
        >
          <Button
            variant="contained"
            startIcon={<SyncIcon />}
            onClick={() => this.fetchData(this.state)}
            style={{
              margin: '0 5px',
              backgroundColor: 'green',
              color: 'white',
            }}
          >
            Refresh
          </Button>
        </div>
        <ReactTable
          columns={[
            {
              Header: 'Showtime',
              accessor: 'showtime._id',
              filterable: false,
              width: 100,
              sortable: false,
              Cell: (e) => (
                <IconButton
                  aria-label="info button"
                  onClick={() => {
                    this.setState({
                      dialog: {
                        ...this.state.dialog,
                        openDialog: true,
                        id: e.value,
                      },
                    });
                  }}
                >
                  <VisibilityIcon fontSize={'small'} />
                </IconButton>
              ),
            },
            {
              Header: 'User',
              accessor: 'user.email',
            },
            {
              Header: 'Seat Type',
              accessor: 'type',
              width: 80,
            },
            {
              Header: 'Price',
              accessor: 'price',
              width: 80,
            },
            {
              Header: 'Seat',
              accessor: 'seatNo',
              width: 100,
            },
            {
              Header: 'CreatedBy',
              accessor: 'createdBy',
              filterable: false,
              width: 100,
              sortable: false,
              Cell: (e) => (
                <IconButton
                  aria-label="info button"
                  onClick={() => {
                    this.setState({
                      dialog: {
                        ...this.state.dialog,
                        open: true,
                        id: e.value,
                      },
                    });
                  }}
                >
                  <VisibilityIcon fontSize={'small'} />
                </IconButton>
              ),
            },
            {
              Header: 'UpdatedBy',
              filterable: false,
              width: 100,
              sortable: false,
              accessor: 'updatedBy',
              Cell: (e) => (
                <IconButton
                  aria-label="info button"
                  onClick={() => {
                    this.setState({
                      dialog: {
                        ...this.state.dialog,
                        open: true,
                        id: e.value,
                      },
                    });
                  }}
                >
                  <VisibilityIcon fontSize={'small'} />
                </IconButton>
              ),
            },
            {
              Header: 'CreatedAt',
              accessor: 'created',
              filterable: false,
            },
            {
              Header: 'UpdatedAt',
              accessor: 'updated',
              filterable: false,
            },
            {
              Header: 'Actions',
              filterable: false,
              width: 100,
              sortable: false,
              Cell: (props) =>
                moment(props.original.showtime.released).diff(date) >= 0 && (
                  <Grid container justify={'center'} alignItems={'center'}>
                    <IconButton
                      color="secondary"
                      aria-label="delete button"
                      onClick={() => {
                        this.setState({
                          dialog: {
                            ...this.state.dialog,
                            confirm: true,
                            id: props.original._id,
                          },
                        });
                      }}
                    >
                      <DeleteForeverOutlinedIcon fontSize={'small'} />
                    </IconButton>
                  </Grid>
                ),
            },
          ]}
          manual
          data={this.state.data}
          pages={this.state.pages}
          loading={this.state.loading}
          defaultPageSize={this.state.pageSize}
          onFetchData={this.fetchData}
          sorted={this.state.sorted}
          onSortedChange={(newSort, column) => {
            this.setState({ sorted: newSort });
          }}
          className="-striped -highlight"
        />

        <DialogTicket
          open={this.state.dialog.open}
          title={'CreatedBy/UpdatedBy Info!'}
          handleClose={this.handleClose}
        >
          <UserInfo id={this.state.dialog.id} />
        </DialogTicket>
        <DialogTicket
          open={this.state.dialog.openDialog}
          title={'Showtime Info!'}
          handleClose={this.toggleShowtimeDialog}
        >
          <ShowtimeInfo id={this.state.dialog.id} />
        </DialogTicket>
        <ConfirmDialog
          open={this.state.dialog.confirm}
          handleClose={() =>
            this.setState({ dialog: { ...this.state.dialog, confirm: false } })
          }
          handleConfirm={() => this.deleteTicket(this.state.dialog.id)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { showErrors })(Reservations);
