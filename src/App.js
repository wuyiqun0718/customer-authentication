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
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

class App extends Component {
  state = {
    selected: -1,
    customers: [],
    open: false,
    name: '',
    email: '',
    password: '',
    nameError: '',
    emailError: '',
    passwordError: ''
  }

  componentDidMount() {
    fetch('http://localhost:3001/customers')
      .then(response => response.json())
      .then(customers => this.setState({ customers }))
      .catch(err => console.log(err))
  }

  isSelected = (index) => {
    return this.state.selected === index;
  };

  handleRowSelection = (selectedRows) => {
    this.setState({ selected: selectedRows });
  };

  addNewCustomer = () => {
    const { name, email, password, customers } = this.state;
    if (!name) this.setState({ nameError: "Name is required" });
    else if (!email) this.setState({ emailError: "Email is required" });
    else if (password.length < 8) this.setState({ passwordError: "Password is required to be at least 8 letters" });
    else {
      this.setState({
        customers: [ ...customers, { name, email, certificates: [] } ],
        open: false,
        name: '',
        password: '',
        email: ''
      });
      fetch('http://localhost:3001/customers', { method: 'post', body: JSON.stringify({ name, email, password }), headers: { "Content-Type": "application/json" } })
        .then(response => response.json())
        .then(customer => console.log(customer))
        .catch(err => console.log(err))
    }
  }

  openDialog = () => {
    this.setState({ open: true });
  }

  closeDialog = () => {
    this.setState({ open: false });
  }

  handleTextFieldChange = (type, e) => {
    const error = `${type}Error`;
    this.setState({ [type]: e.target.value, [error]: '' });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onClick={this.addNewCustomer}
      />,
    ];

    const customerList = this.state.customers.map((customer, index) => {
      const { name, email, certificates } = customer;
      return <TableRow selected={this.isSelected(index)} key={index}>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>{email}</TableRowColumn>
        <TableRowColumn>{certificates.length}</TableRowColumn>
      </TableRow>
    });
    return (
      <div className="App">
        <Table onRowSelection={this.handleRowSelection} allRowsSelected={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>#Certificates</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            {customerList}
          </TableBody>
        </Table>
        <FloatingActionButton onClick={this.openDialog} className="addCustomerButton">
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
              onChange={this.handleTextFieldChange.bind(null, 'name')} 
              value={this.state.name} hintText="Name" 
              floatingLabelText="Name" 
              className="inputField" 
              underlineShow={false} />
            <Divider />
            <TextField 
              onChange={this.handleTextFieldChange.bind(null, 'email')} 
              value={this.state.email} hintText="Email address" 
              floatingLabelText="Email" 
              className="inputField" 
              underlineShow={false} />
            <Divider />
            <TextField 
              onChange={this.handleTextFieldChange.bind(null, 'password')} 
              value={this.state.password} hintText="Password" 
              floatingLabelText="Password" 
              type="password" 
              className="inputField" 
              underlineShow={false} />
            <Divider />

        </Dialog>
      </div>
    );
  }
}

export default App;
