export default theme => ({
    row: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    seat: {
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.7)',
        borderRadius: 2,
        width: 25,
        height: 25,
        textAlign: 'center',
        padding: theme.spacing(0.6),
        margin: theme.spacing(0.5),
        fontWeight: 600,
        '&:hover': {
            background: 'rgb(120, 205, 4)'
        }
    },
    seatEmpty: {
        width: 25,
        height: 25,
        padding: theme.spacing(0.6),
        margin: theme.spacing(0.5),
    },
    seatInfoContainer: {
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',
        color: '#eee'
    },
    showScreen: {
        width: '50%',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        backgroundColor: '#0c1533',
        fontWeight: 600,
        textAlign: 'center',
        color: '#eee'
    },
    text: {
        width: 25,
        height: 25,
        fontSize: 16,
        textAlign: 'center',
        padding: theme.spacing(0.6),
        margin: `0px 40px 0px 0px`,
    },

    seatInfo: {marginRight: theme.spacing(2)},

    seatInfoLabel: {
        marginRight: theme.spacing(1),
        display: 'inline-block',
        width: 10,
        height: 10
    },

    [theme.breakpoints.down('sm')]: {
        seat: {padding: theme.spacing(1.2), margin: theme.spacing(0.5)},
        seatInfoContainer: {width: '100%', display: 'block'},
        seatInfo: {marginTop: theme.spacing(2)}
    }
});