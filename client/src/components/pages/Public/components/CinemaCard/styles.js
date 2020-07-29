export default theme => ({
    root: {
        maxWidth: '100%',
        paddingBottom: theme.spacing(2),
        height: 450,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: '0.4s ease-in-out',
        '&:hover': {
            transform: 'scale(1.03)'
        }
    },
    imageWrapper: {
        height: '200px',
        margin: '0 auto',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    star: {
        position: 'absolute',
        borderRadius: '0 0 10px 0',
        top: 0,
        left: 0,
        height: 60,
        width: 60,
        backgroundColor: '#000',
        color: '#FFF',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'object-fit': 'cover',
    },
    details: {padding: theme.spacing(3)},
    name: {
        fontSize: '18px',
        lineHeight: '21px',
        marginTop: theme.spacing(2),
        textTransform: 'capitalize'
    },
    city: {
        lineHeight: '16px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(1)
    },
    address: {
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(1)
    },
    stats: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(3)
    },
    eventIcon: {
        color: theme.palette.text.secondary
    },
    eventText: {
        marginLeft: theme.spacing(1),
        color: theme.palette.text.secondary
    }
});