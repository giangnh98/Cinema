import React, { useState } from "react";
import classNames from "classnames";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   TablePagination,
   withStyles
} from "@material-ui/core";

import Portlet from "../../../../../Portlet/Portlet";
import PortletContent from "../../../../../PortletContent/PortletContent";
import styles from "./styles";
import { ToTitleCase } from "../../../../../../ultils/utils";
import moment from "moment";
import Button from "@material-ui/core/Button";
import DialogTicket from "../../../../../Ticket/DialogTicket";
import Ticket from "../../../../../Ticket/ticket";

const ReservationsTable = (props) => {
   //define state
   const [paging, setPaging] = useState({
      page: 0,
      rowsPerPage: 5
   });
   const [data, setData] = useState({ open: false, user: {}, reservation: [] });
   //destructuring
   const { page, rowsPerPage } = paging;
   const { className, reservations = [], classes } = props;
   //handle events
   const handleChangePage = (e, newPage) => {
      setPaging({ ...paging, page: newPage });
   };

   const handleChangeRowsPerPage = e => {
      setPaging({ ...paging, rowsPerPage: e.target.value });
   };

   const handleOpen = (reservation) => setData({
      ...data,
      open: true,
      user: localStorage.user,
      reservation: reservation
   });

   const handleClose = () => setData({ ...data, open: false });

   const rootClassName = classNames(classes.root, className);

   return (
      <Portlet className={rootClassName}>
         <PortletContent noPadding>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell align="left">Movie</TableCell>
                     <TableCell align="left">Cinema</TableCell>
                     <TableCell align="left">Date</TableCell>
                     <TableCell align="left">Start At</TableCell>
                     <TableCell align="left">Created At</TableCell>
                     <TableCell align="left">Ticket Price</TableCell>
                     <TableCell align="left">Ticket Info</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {reservations && reservations.length && reservations
                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                     .map(reservation => (
                        <TableRow
                           className={classes.tableRow}
                           hover
                           key={reservation.id}>
                           <TableCell className={classes.tableCell}>
                              {reservation.showtime && reservation.showtime.movie && reservation.showtime.movie.title && ToTitleCase(reservation.showtime.movie.title)}
                           </TableCell>
                           <TableCell className={classes.tableCell}>
                              {reservation.showtime && reservation.showtime.room && reservation.showtime.room.cinema
                              && reservation.showtime.room.cinema.name}
                           </TableCell>
                           <TableCell className={classes.tableCell}>
                              {reservation.showtime && moment(reservation.showtime.released).format("dddd DD/MM/YYYY")}
                           </TableCell>
                           <TableCell className={classes.tableCell}>
                              {reservation.showtime && reservation.showtime.time}
                           </TableCell>
                           <TableCell className={classes.tableCell}>
                              {moment(reservation.created).format("HH:mm a, dddd DD/MM/YYYY")}
                           </TableCell>
                           <TableCell className={classes.tableCell}>
                              {reservation.price}
                           </TableCell>
                           <TableCell className={classes.tableCell}>
                              <Button
                                 color="primary"
                                 variant="contained"
                                 onClick={() => handleOpen(reservation)}>
                                 Detail
                              </Button>
                              <DialogTicket
                                 open={data.open}
                                 title={"Ticket Info!"}
                                 handleClose={handleClose}>
                                 <Ticket user={data.user} ticket={data.reservation}/>
                              </DialogTicket>
                           </TableCell>
                        </TableRow>
                     ))}
               </TableBody>
            </Table>
            <TablePagination
               backIconButtonProps={{
                  "aria-label": "Previous Page"
               }}
               component="div"
               count={reservations.length}
               nextIconButtonProps={{
                  "aria-label": "Next Page"
               }}
               page={page}
               rowsPerPage={rowsPerPage}
               rowsPerPageOptions={[5, 10, 25]}
               onChangePage={handleChangePage}
               onChangeRowsPerPage={handleChangeRowsPerPage}
            />
         </PortletContent>
      </Portlet>
   );
};

export default withStyles(styles)(ReservationsTable);
