import React, { Component } from 'react';
import './RecipeBox.css';
import { Panel, PanelGroup, ListGroup, ListGroupItem, Modal, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';


let recipes = (typeof localStorage.recipeBook != "undefined" ? JSON.parse(localStorage['recipeBook']) : [
{title:"Chocolate Chip Cookies", ingredients: ["Eggs", "Butter", "Sugar", "Brown Sugar", "Flour", "Baking Soda", "Vanilla", "Chocolate Chips"]},
{title:"Salmon Burgers", ingredients:["Eggs", "Salmon", "Flour"]}
]);


export class RecipeBox extends Component {
	handleShow(data) {
		this.setState({
			show:true,
			data:data
		});
	}
	handleClose() {
		this.setState({show:false});
	}
	handleSubmit(data, type) {
		if (type === 'Submit') {
			let b = data.ingredients.map(element => element.replace(/\b\w/g, l => l.toUpperCase()));
			recipes.push({title:data.title.replace(/\b\w/g, l => l.toUpperCase()), ingredients:b});
			localStorage.setItem("recipeBook", JSON.stringify(recipes));
			this.setState({recipes:recipes, data:{title:'', ingredients:'', type:'Submit'}});
			this.handleClose();
		} else {
			let b = data.ingredients.map(element => element.replace(/\b\w/g, l => l.toUpperCase()));
			recipes.map(element => { if(data.oldTitle === element.title) {
					recipes.splice(recipes.indexOf(element), 1, {title:data.title, ingredients:b})
				};
			})
			localStorage.setItem("recipeBook", JSON.stringify(recipes));
			this.setState({recipes:recipes, data: {title:'', ingredients:'', type:'Submit'}});
			this.handleClose();
		}
	}
	handleDelete(a) {
		recipes.map(element => {if(a === element.title) {
			recipes.splice(recipes.indexOf(element), 1)
			}
		});
		this.setState({recipes:recipes});
		localStorage.setItem("recipeBook", JSON.stringify(recipes));
	}
	handleEdit(a) {
		recipes.map(element => {
			if (a === element.title) {
				let data = {title: element.title, ingredients: element.ingredients, type:'Edit'}
				this.handleShow(data);
			}
		});
	}
	constructor(props) {
		super(props);
		this.state = {
			show:false,
			recipes: recipes,
			data: {title:'', ingredients:'', type:'Submit'}
		};
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
	}
	render() {
		return(
			<section className="recipeBox">
				<Book recipes={this.state.recipes} handleDelete={this.handleDelete} handleEdit={this.handleEdit}/>
				<ModalR handlers={{show:this.state.show, handleClose:this.handleClose, handleSubmit:this.handleSubmit, data:this.state.data}} />
				<ButtonP val="Create Recipe" handleClick={() => {this.handleShow(this.state.data)}} />
			</section>
		)
	}
}

class Book extends Component {
	render() { return(
			<PanelGroup accordion>
			{this.props.recipes.map((recipe, index) => 
				<Panel eventKey={index+1}>
					<Panel.Heading>
						<Panel.Title toggle>{recipe.title}</Panel.Title>
					</Panel.Heading>
					<Panel.Body collapsible>
					<ListGroup>
					{recipe.ingredients.map(ingredient => <ListGroupItem>{ingredient}</ListGroupItem>)}
					</ListGroup>
						<Panel.Footer>
							<ButtonR handleClick={() => {this.props.handleDelete(recipe.title)}} val="Delete" />
							<Button handleClick={() => {this.props.handleEdit(recipe.title)}} val="Edit"/>
						</Panel.Footer>
					</Panel.Body>
				</Panel>
			)}
			</PanelGroup>
			);
	}
}

class ModalR extends Component {
	constructor(props) {super(props);this.state = {
			data:{title: this.props.handlers.data.title, ingredients: this.props.handlers.data.ingredients, oldTitle:this.props.handlers.data.oldTitle, type:this.props.handlers.data.type },
			validationT: {status:null, color:'white'},
			validationI: {status:null, color:'white'}
		};
		this.handleChange = this.handleChange.bind(this);this.getValidation = this.getValidation.bind(this);this.resetState = this.resetState.bind(this);
	}

	getValidation(a) {
		if (a === 'recipe') {
			if (this.state.data.title.length >= 3) {
				this.setState({
					validationT: {status: true, color:'green'}
				})} else {this.setState({
					validationT: {status:null, color:'red'}})}} else {
				if (this.state.data.ingredients.length > 0) {
					this.setState({
						validationI: {status:true, color:'green'}
					})} else {
					this.setState({
						validationI: {status: null, color: 'red'}})}}}

	handleChange(e) {
		if (e.target.title === 'recipe') {
			this.setState({
				data: {title:e.target.value, ingredients:this.state.data.ingredients}
			});} else {
			const ing = e.target.value.replace(/([, ]+)[ ,]+/g, ',').split(',');
			this.setState({data: {title:this.state.data.title, ingredients:ing}});}
		this.getValidation(e.target.title);
	}
	resetState() {
		this.setState({
			data:{title:'', ingredients:[], type:'Submit'}, 
			validationI:{status:null, color:'white'}, 
			validationT:{status:null, color:'white'}
		})
	}

	render() {
		return(
			<Modal show={this.props.handlers.show} onHide={this.props.handlers.handleClose}>
				<Modal.Header>
					<Modal.Title>Add a New Recipe!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<FormGroup >
							<ControlLabel>Recipe<Span color={this.state.validationT.color}/></ControlLabel>
							<FormControl type='text' title='recipe' placeholder='Enter Text' onChange={this.handleChange} />
							<ControlLabel>Ingredients<Span color={this.state.validationI.color} /></ControlLabel>
							<FormControl type='text' title='ingredients' placeholder='Enter ingredients, separated by commas' onChange={this.handleChange} />
						</FormGroup>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<ButtonP val={this.props.handlers.data.type} handleClick={() => { 
						if (this.state.validationI.status && this.state.validationT.status) {
							this.props.handlers.handleSubmit({title:this.state.data.title, ingredients:this.state.data.ingredients, type:this.props.handlers.data.type, oldTitle:this.props.handlers.data.title}, this.props.handlers.data.type);this.resetState();
						} else {
							alert('Invalid!')}}}/>
					<Button val="Close" handleClick={() => {this.props.handlers.handleClose();this.resetState();}}/>
				</Modal.Footer>
			</Modal>
			)
	}
}


class Span extends Component {render() {return(<span className="valSpan" style={{backgroundColor:this.props.color}}></span>)}}
class ButtonP extends Component {render() {return(<button className="btn btn-primary" onClick={this.props.handleClick}>{this.props.val}</button>)}}
class Button extends Component {render() {return(<button className="btn" onClick={this.props.handleClick}>{this.props.val}</button>)}}
class ButtonR extends Component {render() {return(<button className="btn btn-danger" onClick={this.props.handleClick}>{this.props.val}</button>)}}

