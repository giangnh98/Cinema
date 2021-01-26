export default (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  date: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderRadius: 10,
    boxShadow: 'unset',
    border: '1px solid white',
  },
  card2: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    boxShadow: 'unset',
    margin: '0px 10px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    '&:hover': {
      border: '1px solid white',
    },
  },
  cardNoBorder: {
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderRadius: 10,
    boxShadow: 'unset',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    '&:hover': {
      border: '1px solid white',
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
  },
  no: {
    marginRight: theme.spacing(1),
  },
});
