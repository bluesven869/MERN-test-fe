import * as React from 'react';
import axios from 'axios';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface IValues {
	id: string,
	name: string,
	email: string,
	dateOfBirth: Date,
	createdAt: Date,
	updatedAt: Date,
}
export interface IFormState {
	[key: string]: any;
	values: IValues[];
	submitSuccess: boolean;
	loading: boolean;
}

class Create extends React.Component<RouteComponentProps, IFormState> {
	constructor(props: RouteComponentProps) {
		super(props);
		this.state = {
			name: '',
			email: '',
			birthday: '',
			values: [],
			loading: false,
			submitSuccess: false,
			submitError: false,
		}
	}

	private processFormSubmission = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		const { name, email, birthday } = this.state;
		if (name === '' || email === '' || birthday === '') {
			return;
		}
		this.setState({ loading: true, submitError: false });
		
		const formData = {
			name,
			email,
			birthday,
		}

		this.setState({ submitSuccess: true, loading: false });
		axios.post(`${process.env.REACT_APP_API_URL}/user`, formData).then(data => {
			if (data.data.hasOwnProperty('errors') || data.data.hasOwnProperty('errmsg')) {
				this.setState({submitError: true});
			} else {
				this.setState({submitError: false});
				setTimeout(() => {
					this.props.history.push('/');
				}, 500)
			}
		});
	}

	private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
		e.preventDefault();
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value,
		})
	}
	public render() {
		const { submitSuccess, loading, submitError } = this.state;
		return (
			<div>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><a href="/">Customers</a></li>
						<li className="breadcrumb-item active" aria-current="page">Add New Customer</li>
					</ol>
				</nav>
				<div className={"col-md-12 form-wrapper"}>
					<h2 style={{textAlign: 'center'}}> Add New Customer </h2>
					{!submitSuccess && (
						<div className="alert alert-info" role="alert">
							Fill the form below to create a new customer
						</div>
					)}
					{submitSuccess && !submitError && (
						<div className="alert alert-info" role="alert">
							The form was successfully submitted!
						</div>
					)}
					{submitSuccess && submitError && (
						<div className="alert alert-danger" role="alert">
							There is an error to create customer, Please review information again.
						</div>
					)}
					<form id={"create-post-form"} onSubmit={this.processFormSubmission} noValidate={true}>
						<div className="form-group">
							<label htmlFor="name"> Name </label>
							<input type="text" id="name" onChange={(e) => this.handleInputChanges(e)} name="name" className="form-control" placeholder="Enter customer's name" />
						</div>
						<div className="form-group">
							<label htmlFor="email"> Email </label>
							<input type="email" id="email" onChange={(e) => this.handleInputChanges(e)} name="email" className="form-control" placeholder="Enter customer's email address" />
						</div>
						<div className="form-group">
							<label htmlFor="birthday"> Date of Birth </label>
							<input type="date" id="birthday" onChange={(e) => this.handleInputChanges(e)} name="birthday" className="form-control" placeholder="Enter customer's date of birth" />
						</div>
						<div className="form-group ">
							<button className="btn btn-success float-right" type="submit">
								Create Customer
							</button>
							{loading &&
								<span className="fa fa-circle-o-notch fa-spin" />
							}
						</div>
					</form>
				</div>
			</div>
		)
	}
}
export default withRouter(Create)