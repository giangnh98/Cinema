import React from "react";
import {Link as RouterLink} from "react-router-dom";
import "../../../../assets/css/404.css";
import Button from "@material-ui/core/Button";

const NotFound = () => {

    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>Oops!</h1>
                    <h2>404 - The Page can't be found</h2>
                </div>
                <Button variant={"outlined"} color={"primary"} component={props => (
                    <RouterLink to={"/"} {...props} />
                )}>
                    Go To Homepage
                </Button>
            </div>
        </div>
    )
};

export default NotFound;