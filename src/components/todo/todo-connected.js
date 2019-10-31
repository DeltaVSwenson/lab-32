import React from 'react';
import { When } from '../if';
import Modal from '../modal';
import Header from './header';
import Form from './form'
import Auth from '../auth/auth';
import LoginProvider from '../auth/provider';
import Login from '../auth/login';
import './todo.scss';
import { SettingsContext } from '../settings/settings'

const todoAPI = 'https://api-js401.herokuapp.com/api/v1/todo';


class ToDo extends React.Component {
  static contextType = SettingsContext;

  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      item: {},
      showDetails: false,
      details: {},
      pageNumber: 1

    };
  }

  handleInputChange = e => {
    let { name, value } = e.target;
    this.setState(state => ({
      item: {...state.item, [name]: value},
    }));
  };

  callAPI = (url, method='get', body, handler, errorHandler) => {

    return fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(data => typeof handler === 'function' ? handler(data) : null )
      .catch( (e) => typeof errorHandler === 'function' ? errorHandler(e) : console.error(e)  );
  };

  addItem = (e) => {

    e.preventDefault();
    e.target.reset();

    const _updateState = newItem =>
      this.setState(state => ({
        todoList: [...state.todoList, newItem],
      }));

    this.callAPI( todoAPI, 'POST', this.state.item, _updateState );

  };

  deleteItem = id => {

    const _updateState = () =>
      this.setState(state => ({
        todoList: state.todoList.filter(item => item._id !== id),
      }));

    this.callAPI( `${todoAPI}/${id}`, 'DELETE', undefined, _updateState );

  };

  saveItem = updatedItem => {

    const _updateState = (newItem) =>
      this.setState(state => ({
        todoList: state.todoList.map(item =>
          item._id === newItem._id ? newItem : item
        ),
      }));

    this.callAPI( `${todoAPI}/${updatedItem._id}`, 'PUT', updatedItem, _updateState );

  };

  toggleComplete = id => {
    let item = this.state.todoList.find(i => i._id === id);
    if (item._id) {
      this.saveItem({
        ...item,
        complete: !item.complete,
      });
    }
  };

  toggleDetails = id => {
    this.setState(state => {
      let item = state.todoList.find(item => item._id === id);
      return {
        details: item || {},
        showDetails: !!item,
      };
    });
  }

  getTodoItems = () => {
    const _updateState = data =>
      this.setState({
        todoList: data.results
      });
    this.callAPI(todoAPI, "GET", undefined, _updateState);
  };

  componentDidMount() {
    this.getTodoItems();
  }
  increasePageNumber = () => {
    this.setState(state => ({
      pageNumber: state.pageNumber + 1
    }));
  };

  decreasePageNumber = () => {
    this.setState(state => ({
      pageNumber: state.pageNumber - 1
    }));
  };
  render() {

    let todoList = this.state.todoList;

    if (!this.context.displayComplete) {
      todoList = todoList.filter(item => !item.complete);
    }

    let { numberOfItems } = this.context;
    let pageCount = Math.ceil(this.state.todoList.length / numberOfItems);
    let pageNumber = Math.min(this.state.pageNumber, pageCount);
    todoList = todoList.slice(
      (pageNumber - 1) * numberOfItems,
      pageNumber * numberOfItems
    );

    return (
      <>
      <LoginProvider>
        <Login
        />
        <Header 
          todoList={this.state.todoList}
        />
        <section className="todo"></section>
        <Auth>
          
          <section className="todo">
          <Auth capability="create">
          <Form
            addItem={this.addItem}
            handleInputChange={this.handleInputChange}
            />
          </Auth>
            <div>
              <Auth capability="read">
                <ul>
                {todoList.map(item => (
                <li
                  className={`complete-${item.complete.toString()}`}
                  key={item._id}
                >
                      <span onClick={() => this.toggleComplete(item._id)}>
                        {item.text}
                      </span>
                      <button onClick={() => this.toggleDetails(item._id)}>
                        Details
                      </button>
                      <Auth capability="delete">
                      <button onClick={() => this.deleteItem(item._id)}>
                        Delete
                      </button>
                      </Auth>
                    </li>
                  ))}
                </ul>
                <button
              onClick={this.decreasePageNumber}
              disabled={pageNumber <= 1}
            >
              Prev
            </button>
            <p>
              Page {pageNumber} of {pageCount}
            </p>
            <button
              onClick={this.increasePageNumber}
              disabled={pageNumber >= pageCount}
            >
              Next
            </button>
            <p>
              Results Per Page: {this.context.numberOfItems} of{" "}
              {this.state.todoList.length}
            </p>
                </Auth>
            </div>
          </section>

          <When condition={this.state.showDetails}>
            <Modal title="To Do Item" close={this.toggleDetails}>
              <div className="todo-details">
                <header>
                  <span>Assigned To: {this.state.details.assignee}</span>
                  <span>Due: {this.state.details.due}</span>
                </header>
                <div className="item">
                  {this.state.details.text}
                </div>
              </div>
            </Modal>
          </When>
          </Auth>
        </LoginProvider>
      </>
    );
  }
}

export default ToDo;
