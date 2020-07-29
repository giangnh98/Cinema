import React from "react";
// Import React Table
import ReactTable from "react-table-6";
import "../../.././../assets/css/react-table.css";
import setAuthHeaders from "../../../../ultils/setAuthToken";
import moment from "moment";
import _ from "lodash";
import { IconButton, Grid, Link, Button } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import SyncIcon from "@material-ui/icons/Sync";
import TheatersIcon from '@material-ui/icons/Theaters';
import DialogTicket from "../../../Ticket/DialogTicket";
import { connect } from "react-redux";
import { showErrors } from "../../../../store/alert/alert.thunk";
import ResponsiveDialog from "../../../ResponsiveDialog/ResponsiveDialog";
import UserInfo from "../User/components/UserInfo";
import ConfirmDialog from "../../../ConfirmDialog/ConfirmDialog";
import AddCinema from "./components/AddCinema";

class Cinema extends React.Component {

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
            openDialog: false,
            confirm: false,
            id: ""
         }
      };
   }

   fetchCinemas = () => {
      fetch(`/api/cinemas`, { method: "GET", headers: setAuthHeaders() })
         .then(response => response.json())
         .then(data => {
            this.setState({
               loading: false,
               pages: Math.ceil(data.length / this.state.pageSize)
            });
         })
         .catch(error => {
            this.setState({
               loading: false
            });
            this.props.showErrors(error.message, "error");
         });
   };

   componentDidMount() {
      this.setState({ loading: true });
      this.fetchCinemas();
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevState.pageSize !== this.state.pageSize) {
         this.fetchCinemas();
      }
   }

   componentWillUnmount() {
      this.setState({});
   }

   fetchData = _.debounce(state => {
      const { showErrors } = this.props;
      this.setState({
         loading: true,
         pageSize: state.pageSize,
         page: state.page
      });
      const objectSort = state.sorted[0];
      const id = objectSort ? objectSort.id.toLowerCase() : "id";
      const sort = objectSort ? objectSort.desc : false;
      const name = state.filtered.find(filter => filter.id === "name");
      const address = state.filtered.find(filter => filter.id === "address");
      const city = state.filtered.find(filter => filter.id === "city");
      const createdBy = state.filtered.find(filter => filter.id === "createdBy");
      const updatedBy = state.filtered.find(filter => filter.id === "updatedBy");
      const url = `/api/cinemas/paginate?pageSize=${state.pageSize}
               &page=${state.page}
               &sortBy=${id}
               &sortType=${sort ? "descending" : "ascending"}
               &name=${name ? name.value : ""}
               &address=${address ? address.value : ""}
               &city=${city ? city.value : ""}
               &createdBy=${createdBy ? createdBy.value : ""}
               &updatedBy=${updatedBy ? updatedBy.value : ""}`;
      fetch(url, { method: "GET", headers: setAuthHeaders() })
         .then(response => response.json())
         .then(data => {
            data.map(row => {
               row.created = moment(row.created).format("HH:mm a, dddd DD/MM/YYYY");
               row.updated = moment(row.updated).format("HH:mm a, dddd DD/MM/YYYY");
               return row;
            });
            this.setState({
               loading: false,
               data: data
            });
         })
         .catch(error => {
            this.setState({
               loading: false
            });
            showErrors(error.message, "error");
         });
   }, 80);

   deleteCinema = (cinemaId) => {
      this.setState({
         loading: true,
         dialog: { ...this.state.dialog, confirm: false }
      });
      fetch(`/api/cinemas/${cinemaId}`, { method: "DELETE", headers: setAuthHeaders() })
         .then(response => response.json())
         .then(data => {
            this.setState({
               loading: false
            });
            if (!data.error) {
               this.props.showErrors("Delete Cinema Success!", "success");
            } else if (data.error) {
               this.props.showErrors(data.message, "error");
            }
         })
         .catch(error => {
            this.setState({
               loading: false
            });
            this.props.showErrors(error.message, "error");
         });
   };

   handleClose = () => {
      this.setState({ dialog: { ...this.state.dialog, open: false } });
   };

   toggleDialog = () => {
      this.setState({ dialog: { ...this.state.dialog, openDialog: false } });
   };

   toggleConfirm = () => {
      this.setState({ dialog: { ...this.state.dialog, confirm: false } });
   };

   render() {
      return (
         <div>
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
               <Button variant="contained" color="primary" startIcon={<TheatersIcon/>}
                       style={{ margin: "0 5px" }}
                       onClick={() => this.setState({ dialog: { ...this.state.dialog, openDialog: true, id: "" } })}>
                  Add Cinema
               </Button>
               <Button variant="contained" startIcon={<SyncIcon/>} onClick={() => this.fetchData(this.state)}
                       style={{ margin: "0 5px", backgroundColor: "green", color: "white" }}>
                  Refresh
               </Button>
            </div>
            <ReactTable
               columns={[
                  {
                     Header: "Name",
                     accessor: "name"
                  },
                  {
                     Header: "Address",
                     accessor: "address"
                  },
                  {
                     Header: "City",
                     accessor: "city",
                     width: 100
                  },
                  {
                     Header: "CreatedBy",
                     accessor: "createdBy",
                     Cell: e => (
                        <Link
                           component="button"
                           variant="body2"
                           onClick={() => {
                              this.setState({ dialog: { ...this.state.dialog, open: true, id: e.value } });
                           }}
                        >
                           {e.value}
                        </Link>
                     )
                  },
                  {
                     Header: "UpdatedBy",
                     accessor: "updatedBy",
                     Cell: e => (
                        <Link
                           component="button"
                           variant="body2"
                           onClick={() => {
                              this.setState({ dialog: { ...this.state.dialog, open: true, id: e.value } });
                           }}
                        >
                           {e.value}
                        </Link>
                     )
                  },
                  {
                     Header: "CreatedAt",
                     accessor: "created",
                     filterable: false
                  },
                  {
                     Header: "UpdatedAt",
                     accessor: "updated",
                     filterable: false
                  },
                  {
                     Header: "Actions",
                     accessor: "cinema",
                     filterable: false,
                     width: 100,
                     sortable: false,
                     Cell: props => (
                        <Grid container justify={"center"} alignItems={"center"}>
                           <IconButton color="primary" aria-label="edit button"
                                       onClick={() => {
                                          this.setState({
                                             dialog: {
                                                ...this.state.dialog,
                                                openDialog: true,
                                                id: props.original.id
                                             }
                                          });
                                       }}>
                              <EditOutlinedIcon fontSize={"small"}/>
                           </IconButton>
                           <IconButton color="secondary" aria-label="delete button"
                                       onClick={() => {
                                          this.setState({
                                             dialog: {
                                                ...this.state.dialog,
                                                confirm: true,
                                                id: props.original.id
                                             }
                                          });
                                       }}>
                              <DeleteForeverOutlinedIcon fontSize={"small"}/>
                           </IconButton>
                        </Grid>
                     )
                  }
               ]}
               manual
               filterable
               data={this.state.data}
               pages={this.state.pages}
               loading={this.state.loading}
               defaultPageSize={this.state.pageSize}
               onFetchData={this.fetchData}
               sorted={this.state.sorted}
               onSortedChange={(newSort, column) => {
                  this.setState({ sorted: newSort });
               }}
               onFilteredChange={filtered => this.setState({ filtered })}
               className="-striped -highlight"
            />

            <DialogTicket open={this.state.dialog.open} title={"CreatedBy/UpdatedBy Info!"}
                          handleClose={this.handleClose}>
               <UserInfo id={this.state.dialog.id}/>
            </DialogTicket>
            <ResponsiveDialog
               id="Add-user"
               open={this.state.dialog.openDialog}
               handleClose={this.toggleDialog}>
               <AddCinema selectedCinema={this.state.data.find(item => item.id === this.state.dialog.id)}/>
            </ResponsiveDialog>
            <ConfirmDialog
               open={this.state.dialog.confirm}
               handleClose={this.toggleConfirm}
               handleConfirm={() => this.deleteCinema(this.state.dialog.id)}
            />
         </div>
      );
   }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { showErrors })(Cinema);