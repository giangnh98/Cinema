export default theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    process: {
        fontSize: theme.spacing(2),
        textTransform: 'capitalize',
        color: theme.palette.common.white,
        marginLeft: 10
    },
    container: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(2)
    },
    [theme.breakpoints.down('md')]: {
        root: {height: '100%'}
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    showStep: {
        height: '100%'
    },
    showInfo: {}
});