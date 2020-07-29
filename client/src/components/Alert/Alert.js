import React from "react";
import CustomizedSnackbar from "../CustomizedSnackbar/CustomizedSnackbar";
import { connect } from "react-redux";
import { clearErrors } from "../../store/alert/alert.thunk";

const Alert = (props) => {
   const { alerts, open, clearErrors } = props;

   return (
      alerts.length > 0 && alerts.map((alert, index) => (
         <CustomizedSnackbar
            key={`custom-alert-${index}-${alert.id}`}
            isOpen={open}
            removeAlert={clearErrors}
            vertical="top"
            horizontal="right"
            variant={alert.type}
            message={alert.msg}
         />
      ))
   );
};

const mapStateToProps = ({ alertState }) => ({
   alerts: alertState.alerts,
   open: alertState.open
});

export default connect(mapStateToProps, { clearErrors })(Alert);