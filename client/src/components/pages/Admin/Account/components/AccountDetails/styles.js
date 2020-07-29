export default theme => ({
    root: {},
    field: {
        margin: `${theme.spacing(3)}px ${theme.spacing(3)}px 0 ${theme.spacing(3)}px`
    },
    field1: {
        margin: `0 ${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
    },
    textField: {
        width: '420px',
        maxWidth: '100%',
        marginRight: theme.spacing(3)
    },
    portletFooter: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    }
});
