import React from 'react';
import {
    Grid,
    IconButton,
} from '@material-ui/core';
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons';
import useStyles from "./styles";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = (props) => {
    const classes = useStyles();

    const handleBack = () => {
        const {history} = props;
        history.goBack();
    };

    return (
        <div className={classes.root}>
            <Grid className={classes.grid} container>
                <Grid className={classes.bgWrapper} item lg={5}>
                    <div className={classes.bg}/>
                </Grid>
                <Grid className={classes.content} item lg={7} xs={12}>
                    <div className={classes.content}>
                        <div className={classes.contentHeader}>
                            <IconButton
                                className={classes.backButton}
                                onClick={handleBack}>
                                <ArrowBackIcon/>
                            </IconButton>
                        </div>
                        <div className={classes.contentBody}>
                            <RegisterForm classes={classes} {...props}/>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default RegisterPage;
