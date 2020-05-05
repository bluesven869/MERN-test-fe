import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
export interface IValues {
	[key: string]: any;
}
export interface IFormState {
	id: number,
	customer: any;
	values: IValues[];
	submitSuccess: boolean;
	loading: boolean;
	submitError: boolean,
}

class EditCustomer extends React.Component<RouteComponentProps<any>, IFormState> {
	constructor(props: RouteComponentProps) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			customer: {},
			values: [],
			loading: false,
			submitSuccess: false,
			submitError: false,
		}
	}
	public componentDidMount(): void {
		axios.get(`${process.env.REACT_APP_API_URL}/user/${this.state.id}`).then(data => {
			this.setState({ customer: data.data });
		})
	}

	private processFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		
		this.setState({ loading: true });
		axios.put(`${process.env.REACT_APP_API_URL}/user/${this.state.id}`, this.state.values).then(data => {
			this.setState({ submitSuccess: true, loading: false })
			if (data.data.hasOwnProperty('errors') || data.data.hasOwnProperty('errmsg')) {
				this.setState({submitError: true});
			} else {
				this.setState({submitError: false});
				setTimeout(() => {
					this.props.history.push('/');
				}, 500)
			}
		})
	}

	private setValues = (values: IValues) => {
		this.setState({ values: { ...this.state.values, ...values } });
	}

	private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
		e.preventDefault();
		this.setValues({ [e.currentTarget.id]: e.currentTarget.value })
	}

	public render() {
		const { submitSuccess, loading, submitError, customer: {
			name, email, birthday
		} } = this.state;

		const birthOfDate =  moment(birthday).format('yyyy-MM-DD');
		
		if (!birthday) return null;
		return (
			<div>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><a href="/">Customers</a></li>
						<li className="breadcrumb-item active" aria-current="page">Edit Customer</li>
					</ol>
				</nav>
				{this.state.customer &&
					<div>
						<div>
							<div className={"col-md-12 form-wrapper"}>
								<h2 style={{textAlign: 'center'}}> Edit Customer </h2>
								{submitSuccess && !submitError && (
									<div className="alert alert-info" role="alert">
										Customer's details has been edited successfully </div>
								)}
								{submitSuccess && submitError && (
									<div className="alert alert-danger" role="alert">
										There is an error to create customer, Please review information again.
									</div>
								)}
								
								<form id={"create-post-form"} onSubmit={this.processFormSubmission} noValidate={true}>
									<div className="form-group">
										<label htmlFor="name"> Name </label>
										<input type="text" id="name" defaultValue={name} onChange={(e) => this.handleInputChanges(e)} name="name" className="form-control" placeholder="Enter customer's name" />
									</div>
									<div className="form-group">
										<label htmlFor="email"> Email </label>
										<input type="email" id="email" defaultValue={email} onChange={(e) => this.handleInputChanges(e)} name="email" className="form-control" placeholder="Enter customer's email address" />
									</div>
									<div className="form-group">
										<label htmlFor="birthday"> Birthday </label>
										<input type="date" id="birthday" defaultValue={birthOfDate} onChange={(e) => this.handleInputChanges(e)} name="birthday" className="form-control" placeholder="Enter customer's birthday" />
									</div>
									<div className="form-group">
										<button className="btn btn-success float-right" type="submit">
											Edit Customer </button>
										{loading &&
											<span className="fa fa-circle-o-notch fa-spin" />
										}
									</div>
								</form>
							</div>
						</div>
					</div>
				}
			</div>
		)
	}
}
export default withRouter(EditCustomer)