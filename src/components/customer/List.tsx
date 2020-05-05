import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

interface IState {
	customers: any[],
	selectedCustomers: any[];
}

export default class Home extends React.Component<RouteComponentProps, IState> {

	constructor(props: RouteComponentProps) {
		super(props);
		this.state = { customers: [], selectedCustomers: [] }
	}

	public componentDidMount(): void {
		axios.get(`${process.env.REACT_APP_API_URL}/users`).then(data => {
			this.setState({ customers: data.data })
		})
	}
	
	public deleteCustomer(id: number) {
		axios.delete(`${process.env.REACT_APP_API_URL}/user/${id}`).then(data => {
			const index = this.state.customers.findIndex(customer => customer.id === id);
			this.state.customers.splice(index, 1);
			this.props.history.push('/');
		})
	}

	public selectCustomerRandomly() {
		const { customers, selectedCustomers } = this.state;
		const selectedIds = selectedCustomers.map(customer=>customer.id);
		const filteredCustomers = customers.filter(customer => selectedIds.indexOf(customer.id) < 0 );
		
		if (filteredCustomers.length === 0) {
			alert("no customers that can be selected");
		} else {
			const selectedIndex = Math.floor(Math.random() * Math.floor(filteredCustomers.length));
			selectedCustomers.push(filteredCustomers[selectedIndex]);
			this.setState({selectedCustomers})
		}
	}

	public clearSelectedCustomers() {
		this.setState({selectedCustomers: []});
	}

	public render() {
		const { customers, selectedCustomers } = this.state;
		return (
			<div>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item active" aria-current="page">Customers</li>
					</ol>
				</nav>
				{customers.length === 0 && (
					<div className="text-center">
						<h2>No customer found at the moment</h2>
					</div>
				)}
				
				<div className="container" style={{marginTop: 50}}>
					<div className="row">
						<div style={{textAlign: 'right', width: '100%'}}>
							<Link to={'/create'} className="btn btn-sm btn-outline-secondary right"> Create Customer </Link>
						</div>
						<table className="table table-bordered" style={{marginTop: 20}}>
							<thead className="thead-light">
								<tr>
									<th scope="col">Name</th>
									<th scope="col">Email</th>
									<th scope="col">Date of Birth</th>
									<th scope="col">Created At</th>
									<th scope="col">Updated At</th>
									<th scope="col">Actions</th>
								</tr>
							</thead>
							<tbody>
								{customers && customers.map(customer =>
									<tr key={customer.id}>
										<td>{customer.name}</td>
										<td>{customer.email}</td>
										<td>{moment(customer.birthday).format('MMM Do, YYYY')}</td>
										<td>{moment(customer.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
										<td>{moment(customer.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
										<td>
											<div className="d-flex justify-content-between align-items-center">
												<div className="btn-group" style={{ marginBottom: "20px" }}>
													<Link to={`edit/${customer.id}`} className="btn btn-sm btn-outline-secondary" style={{width: 60}}>Edit</Link>
													<button className="btn btn-sm btn-outline-secondary" style={{width: 60}} onClick={() => this.deleteCustomer(customer.id)}>Delete</button>
												</div>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="row">
						
						<button className="btn btn-sm btn-outline-secondary float-right" style={{ marginRight: 20}} onClick={() => this.selectCustomerRandomly()}>Select Customer</button>
						<button className="btn btn-sm btn-outline-secondary float-right" onClick={() => this.clearSelectedCustomers()}>Clear Selected Customers</button>
						<table className="table table-bordered" style={{marginTop: 20}}>
							<thead className="thead-light">
								<tr>
									<th scope="col">Name</th>
									<th scope="col">Email</th>
									<th scope="col">Date of Birth</th>
									<th scope="col">Created At</th>
									<th scope="col">Updated At</th>
								</tr>
							</thead>
							<tbody>
								{selectedCustomers && selectedCustomers.map(customer =>
									<tr key={customer.id}>
										<td>{customer.name}</td>
										<td>{customer.email}</td>
										<td>{moment(customer.birthday).format('MMM Do, YYYY')}</td>
										<td>{moment(customer.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
										<td>{moment(customer.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}