import React from "react";
import "../../assets/css/ticket.css";
import moment from "moment";

const Ticket = ({ ticket, user }) => {

   const currentUser = JSON.parse(user);
   const { showtime: { movie, room: { name }, released, time }, seats } = ticket;

   return (
      <div className="cardWrap">
         <div className="card cardLeft">
            <h1>Startup <span>Cinema</span></h1>
            <div className="title">
               <h2>{movie.title}</h2>
               <span>movie</span>
            </div>
            <div className="name">
               <h2>{currentUser.name}</h2>
               <span>name</span>
            </div>
            <div className="seat">
               <h2>{name}</h2>
               <span>room</span>
            </div>
            <div className="time">
               <h2>{moment(released).format("DD/MM/YYYY")}</h2>
               <span>date</span>
            </div>
            <div className="time">
               <h2>{time}</h2>
               <span>time</span>
            </div>
         </div>
         <div className="card cardRight">
            <div className="eye"/>
            <div className="number">
               <h3>{String.fromCharCode(97 + seats[0]).toUpperCase() + "" + seats[1]}</h3>
               <span>seat</span>
            </div>
            <div className="barcode"/>
         </div>

      </div>
   );
};

export default Ticket;