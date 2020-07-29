import { withStyles, Switch } from "@material-ui/core";

export const AntSwitch = withStyles((theme) => ({
   root: {
      width: 28,
      height: 16,
      padding: 0,
      display: "flex"
   },
   switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      "&$checked": {
         transform: "translateX(12px)",
         color: theme.palette.common.white,
         "& + $track": {
            opacity: 1,
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main
         }
      }
   },
   thumb: {
      width: 12,
      height: 12,
      boxShadow: "none"
   },
   track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white
   },
   checked: {}
}))(Switch);

export const makeStyles = theme => ({
   root: {},
   title: { marginLeft: theme.spacing(3) },
   field: {
      margin: theme.spacing(3),
      display: "flex"
   },
   textField: {
      width: "100%",
      marginRight: theme.spacing(3)
   },
   img: {
      height: 255,
      maxWidth: 400,
      overflow: "hidden",
      display: "block",
      width: "100%"
   },
   portletFooter: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
   },
   buttonFooter: {
      margin: theme.spacing(3)
   },
   infoMessage: {
      marginLeft: theme.spacing(3)
   }
});