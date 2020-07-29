import React from "react";
// Import React Table
import ReactTable from "react-table-6";
import "../../.././../assets/css/react-table.css";
import moment, { now } from "moment";
import _ from "lodash";
import { Link, Button, Grid, IconButton } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";
import setAuthHeaders from "../../../../ultils/setAuthToken";
import { showErrors } from "../../../../store/alert/alert.thunk";
import { connect } from "react-redux";
import UserInfo from "../User/components/UserInfo";
import DialogTicket from "../../../Ticket/DialogTicket";
import ShowtimeInfo from "../Reservations/components/ShowtimeInfo";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";

class Prebooking extends React.Component {

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
            id: ""
         }
      };
   }

   fetchPrebooking = () => {
      fetch(`/api/prebooking`, { method: "GET" })
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
            console.log(error.message);
         });
   };

   componentDidMount() {
      this.setState({ loading: true });
      this.fetchPrebooking();
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevState.pageSize !== this.state.pageSize) {
         this.fetchPrebooking();
      }
   }

   componentWillUnmount() {
      this.setState({});
   }

   fetchData = _.debounce(state => {
      this.setState({
         loading: true,
         pageSize: state.pageSize,
         page: state.page
      });
      const objectSort = state.sorted[0];
      const id = objectSort ? objectSort.id.toLowerCase() : "id";
      const sort = objectSort ? objectSort.desc : false;
      const url = `/api/prebooking/paginate?pageSize=${state.pageSize}
               &page=${state.page}
               &sortBy=${id}
               &sortType=${sort ? "descending" : "ascending"}`;
      fetch(url, { method: "GET", headers: setAuthHeaders() })
         .then(response => response.json())
         .then(data => {
            this.setState({
               loading: false,
               data: data
            });
         })
         .catch(error => {
            this.setState({
               loading: false
            });
            this.props.showErrors(error.message, "error");
         });
   }, 80);

   deletePrebooking = (prebookingId) => {
      this.setState({
         loading: true
      });
      fetch(`/api/prebooking/${prebookingId}`, { method: "DELETE", headers: setAuthHeaders() })
         .then(response => response.json())
         .then(data => {
            this.setState({
               loading: false
            });
            if (!data.error) {
               this.props.showErrors("Delete Prebooking Success!", "success");
            }
            if (data.error) {
               this.props.showErrors(data.message, "success");
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

   toggleShowtimeDialog = () => {
      this.setState({ dialog: { ...this.state.dialog, openDialog: false } });
   };

   render() {
      return (
         <div>
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
               <Button variant="contained" startIcon={<SyncIcon/>} onClick={() => this.fetchData(this.state)}
                       style={{ margin: "0 5px", backgroundColor: "green", color: "white" }}>
                  Refresh
               </Button>
            </div>
            <ReactTable
               columns={[
                  {
                     Header: "Showtime",
                     accessor: "showtime",
                     Cell: e => (
                        <Link
                           component="button"
                           variant="body2"
                           onClick={() => {
                              this.setState({ dialog: { ...this.state.dialog, openDialog: true, id: e.value } });
                           }}
                        >
                           {e.value}
                        </Link>
                     )
                  },
                  {
                     Header: "User",
                     accessor: "user",
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
                     Header: "Seat",
                     accessor: "seats",
                     width: 100,
                     Cell: e => `${String.fromCharCode(97 + e.original.seats[0]).toUpperCase()}${e.original.seats[1]}`
                  },
                  {
                     Header: "CreatedAt",
                     accessor: "created",
                     Cell: e => moment(e.value).format('HH:mm a, dddd DD/MM/YYYY')
                  },
                  {
                     Header: "UnpaidTime",
                     accessor: "prebooking",
                     Cell: e => `${moment.utc(moment(now()).diff(moment(e.original.created))).format("HH:mm:ss")}`
                  },
                  {
                     Header: "Actions",
                     accessor: "prebooking",
                     width: 100,
                     sortable: false,
                     Cell: props => (
                        <Grid container justify={"center"} alignItems={"center"}>
                           <IconButton color="secondary" aria-label="delete button"
                                       onClick={() => {
                                          this.deletePrebooking(props.original.id);
                                       }}>
                              <DeleteForeverOutlinedIcon fontSize={"small"}/>
                           </IconButton>
                        </Grid>
                     )
                  }
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

            <DialogTicket open={this.state.dialog.open} title={"User Info!"}
                          handleClose={this.handleClose}>
               <UserInfo id={this.state.dialog.id}/>
            </DialogTicket>
            <DialogTicket open={this.state.dialog.openDialog} title={"Showtime Info!"}
                          handleClose={this.toggleShowtimeDialog}>
               <ShowtimeInfo id={this.state.dialog.id}/>
            </DialogTicket>
         </div>
      );
   }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { showErrors })(Prebooking);