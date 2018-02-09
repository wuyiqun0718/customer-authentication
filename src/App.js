import React, { Component } from 'react';
import "./App.css";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { FlatButton, FloatingActionButton, RaisedButton } from "material-ui";
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import IconButton from "material-ui/IconButton";

class App extends Component {
  state = {
    customers: [],
    open: false,
    name: "",
    email: "",
    password: "",
    nameError: "",
    emailError: "",
    passwordError: ""
  };

  componentDidMount() {
    fetch("http://localhost:5000/customers")
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
      fetch("http://localhost:5000/customers", {
        method: "post",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" }
      })
        .then(response => response.json())
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
    fetch("http://localhost:5000/customers/" + _id, { method: "delete" })
      .then(response => response.json())
      .then(data =>
        this.setState(({ customers }) => {
          return {
            customers: customers.filter(customer => customer._id != _id)
          };
        })
      )
      .catch(err => console.log(err));
  };

  addCertificate = (_id) => {
    fetch("http://localhost:5000/certificates/", {
        method: "post",
        body: JSON.stringify({ customerId: _id }),
        headers: { "Content-Type": "application/json" }
      })
      .then(response => response.json())
      .then(data => this.setState(({ customers }) => {
          const index = customers.findIndex(customer => customer._id === _id);
          if (index == -1) return { customers }; 
          customers[index].certificates++;
          return { customers };
        }))
      .catch(err => console.log(err));
  };

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

    const customerList = this.state.customers.map((customer, index) => {
      const { name, email, certificates, _id } = customer;
      return (
        <TableRow key={index}>
          <TableRowColumn>{name}</TableRowColumn>
          <TableRowColumn>{email}</TableRowColumn>
          <TableRowColumn>{certificates}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label="Add Cert"
              primary={true}
              onClick={this.addCertificate.bind(null, _id)}
            />
          </TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label="Delete"
              secondary={true}
              onClick={this.deleteCustomer.bind(null, _id)}
            />
          </TableRowColumn>
          <TableRowColumn>
            <IconButton touch={true}>
              <NavigationExpandMoreIcon />
            </IconButton>
          </TableRowColumn>
        </TableRow>
      );
    });
    return (
      <div className="App">
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>#Certificates</TableHeaderColumn>
              <TableHeaderColumn />
              <TableHeaderColumn />
              <TableHeaderColumn />
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            {customerList}
          </TableBody>
        </Table>
        <FloatingActionButton
          onClick={this.openDialog}
          className="addCustomerButton"
        >
          <ContentAdd />
        </FloatingActionButton>
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
