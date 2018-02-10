import React, { Component } from 'react';
import { origin } from './config';
import "./App.css";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { FlatButton, RaisedButton } from "material-ui";
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import IconButton from "material-ui/IconButton";
import Toggle from 'material-ui/Toggle';

const Button_Style = { margin: 5 };
class App extends Component {
  state = {
    customers: [],
    open: false,
    expanded: "",
    name: "",
    email: "",
    password: "",
    nameError: "",
    emailError: "",
    passwordError: ""
  };

  componentDidMount() {
    fetch(`${origin}/customers`)
      .then(response => response.json())
      .then(customers => this.setState({ customers }))
      .catch(err => console.log(err));
  }

  addNewCustomer = () => {
    const { name, email, password, customers } = this.state;
    if (!name) this.setState({ nameError: "Name is required" });
    else if (!email) this.setState({ emailError: "Email is required" });
    else if (password.length < 8)
      this.setState({
        passwordError: "Password is required to be at least 8 letters"
      });
    else {
      this.setState({
        open: false,
        name: "",
        password: "",
        email: ""
      });
      fetch(`${origin}/customers`, {
        method: "post",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" }
      }).then(response => response.json())
        .then(customer =>
          this.setState({ customers: [...customers, customer] })
        )
        .catch(err => console.log(err));
    }
  };

  openDialog = () => {
    this.setState({ open: true });
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  handleTextFieldChange = (type, e) => {
    const error = `${type}Error`;
    this.setState({ [type]: e.target.value, [error]: "" });
  };

  deleteCustomer = (_id, e) => {
    fetch(`${origin}/customers/${_id}`, { method: "delete" })
      .then(response => response.json())
      .then(data =>
        this.setState(({ customers }) => {
          return {
            customers: customers.filter(customer => customer._id !== _id)
          };
        })
      )
      .catch(err => console.log(err));
  };

  addCertificate = (_id) => {
    fetch(`${origin}/certificates/`, {
        method: "post",
        body: JSON.stringify({ customerId: _id }),
        headers: { "Content-Type": "application/json" }
      })
      .then(response => response.json())
      .then(data => this.setState(({ customers }) => {
          const index = customers.findIndex(customer => customer._id === _id);
          if (index === -1) return { customers }; 
          customers[index].certificates.push(data);
          return { customers };
        }))
      .catch(err => console.log(err));
  };

  toggleCertificate = (_id) => {
    this.setState(({ expanded }) => ({ expanded: expanded === _id ? "" : _id}))
  }

  toggleCertificateStatus = (customerId, certIndex) => {
    this.setState(({ customers }) => {
      const index = customers.findIndex(customer => customer._id === customerId);
      if (index === -1) return { customers }; 
      const { isActive: oldStatus, _id } = customers[index].certificates[certIndex];
      customers[index].certificates[certIndex].isActive = !oldStatus;
      fetch(`${origin}/certificates/` + _id, {
        method: "post",
        body: JSON.stringify({ status: !oldStatus }),
        headers: { "Content-Type": "application/json" }
      }).then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
      return { customers };
    })
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.closeDialog} />,
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onClick={this.addNewCustomer}
      />
    ];
    const { expanded, customers } = this.state;
    let showCertificate = -1;
    const customerList = customers.map((customer, index) => {
      const { name, email, certificates, _id } = customer;
      const expandButton = expanded === _id ? (<NavigationExpandLessIcon />) : (<NavigationExpandMoreIcon />);
      if (expanded === _id) showCertificate = index;
      return (
        <TableRow key={index}>
          <TableRowColumn>{name}</TableRowColumn>
          <TableRowColumn>{email}</TableRowColumn>
          <TableRowColumn>{certificates.length}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label="Add Cert"
              primary={true}
              style={Button_Style}
              onClick={this.addCertificate.bind(null, _id)}
            />
            <RaisedButton
              label="Delete"
              secondary={true}
              style={Button_Style}
              onClick={this.deleteCustomer.bind(null, _id)}
            />
          </TableRowColumn>
          <TableRowColumn>
            <IconButton touch={true} onClick={this.toggleCertificate.bind(null, _id)}>
              {expandButton}
            </IconButton>
          </TableRowColumn>
        </TableRow>
      );
    });
    if (showCertificate !== -1) {
      const certificates = customers[showCertificate].certificates; 
      if (certificates.length > 0) {
        const certCard = certificates.map((certificate, index) => {
            const { isActive, _id, cert, key, customerId } = certificate;
            const textDecoration = isActive ? 'none' : 'line-through';
            const style = { height: 'auto', whiteSpace: 'normal', textDecoration };
            return <TableRow key={_id}>
              <TableRowColumn colSpan={2}>
                <div style={style}>{key}</div>
              </TableRowColumn>
              <TableRowColumn colSpan={2}>
                <div style={style}>{cert}</div>
              </TableRowColumn>
              <TableRowColumn>
                <Toggle 
                  label={isActive ? "Active" : "InActive"}
                  toggled={isActive}
                  onToggle={this.toggleCertificateStatus.bind(null, customerId, index)}
                  labelPosition="right" />
              </TableRowColumn>
            </TableRow>
          })
        customerList.splice(showCertificate + 1, 0, certCard);
      }
    }
    return (
      <div className="App">
        <div className="addCustomerButton">
          <RaisedButton
            onClick={this.openDialog}
            label="New Customer"
          />
        </div>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>#Cert</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
              <TableHeaderColumn>View Cert</TableHeaderColumn>
              {/* <TableHeaderColumn /> */}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            {customerList}
          </TableBody>
        </Table>
        <Dialog
          title="Create a new customer"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.closeDialog}
        >
          <TextField
            errorText={this.state.nameError}
            onChange={this.handleTextFieldChange.bind(null, "name")}
            value={this.state.name}
            hintText="Name"
            floatingLabelText="Name"
            className="inputField"
            underlineShow={false}
          />
          <Divider />
          <TextField
            onChange={this.handleTextFieldChange.bind(null, "email")}
            value={this.state.email}
            hintText="Email address"
            floatingLabelText="Email"
            className="inputField"
            underlineShow={false}
          />
          <Divider />
          <TextField
            onChange={this.handleTextFieldChange.bind(null, "password")}
            value={this.state.password}
            hintText="Password"
            floatingLabelText="Password"
            type="password"
            className="inputField"
            underlineShow={false}
          />
          <Divider />
        </Dialog>
      </div>
    );
  }
}

export default App;
