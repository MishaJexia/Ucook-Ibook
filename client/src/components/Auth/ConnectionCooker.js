import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import SaveIcon from '@material-ui/icons/Save'
import { connect } from 'react-redux'
import { connectionCooker } from '../../actions/authcookerActions'

const styles = {
    textField: {
        marginTop: '1%',
        marginRigth: '1%',
        width: '100%'
    },
    btnBlock: {
        textAlign: 'center',
        margin: '2%',
    }
}

class ConnectionCooker extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: '',
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount () {
        if(this.props.auth2.isAuthenticated2) {
            this.props.history.push('/')
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors })
        }

        if (nextProps.auth2.isAuthenticated2) {
            this.props.history.push('/')
        }
    }

    handleChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault()
        const cookerData = {
            login: this.state.login,
            password: this.state.password,
        }
        this.props.connectionCooker(cookerData)
    }

    render() {
        const { classes } = this.props;
        const { errors } = this.state
        return (
            <Paper style={{ padding: 8, marginTop: '60px' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        type="login"
                        label="Login"
                        className={classes.textField}
                        value={this.state.login}
                        name="login"
                        onChange={this.handleChange}
                        helperText={errors.login ? errors.login : ''}
                        error={errors.login ? true : false}
                        placeholder="EX: koko"/>

                    <TextField
                        variant="outlined"
                        type="password"
                        label="Password"
                        className={classes.textField}
                        value={this.state.password}
                        name="password"
                        onChange={this.handleChange}
                        helperText={errors.password ? errors.password : ''}
                        error={errors.password ? true : false}
                        placeholder="Tape your password"/>

                    <div className={classes.btnBlock}>
                    <Button variant="contained" style={{ backgroundColor: '#ffab91' }} type="submit" className={classes.button} startIcon={<SaveIcon/>} value="Submit">Connection</Button>
                    </div>
                </form>
            </Paper>
        )
    }
}

const mapStateToProps = (state) => ({
    auth2: state.auth2,
    errors: state.errors
})

export default connect(mapStateToProps, { connectionCooker })(withRouter(withStyles(styles)(ConnectionCooker)))