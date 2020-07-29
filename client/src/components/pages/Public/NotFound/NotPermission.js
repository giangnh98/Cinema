import React from "react";
import {Link as RouterLink} from "react-router-dom";
import "../../../../assets/css/404.css";
import Button from "@material-ui/core/Button";

const NotPermission = () => {

   return (
      <div id="notfound">
         <div className="notfound">
            <div className="notfound-404">
               <h1>Oops!</h1>
               <h2>403 - You don't have permission to access this resources</h2>
            </div>
            <Button variant={"outlined"} color={"primary"} component={props => (
               <RouterLink to={"/admin/showtimes"} {...props} />
            )}>
               Go To AdminPage
            </Button>
         </div>
      </div>
   )
};

export default NotPermission;