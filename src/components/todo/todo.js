import React from 'react';
import uuid from 'uuid/v4';
import { When } from '../if';
import Modal from '../modal';
import Form from './form';
import Header from './header';
import List from './list';
import './todo.scss';
import {useState} from 'react';

export default function App(){
  const initialList = []
  let [todoList, setToDolist] = useState(initialList);

  const initialItem = {};
  let [item, setItem] = useState(initialItem);

  const initialDetails = {};
  let [details, setDetails] = useState(initialDetails);

  const initialShow = false;
  let [showDetails, setShowDetails] = useState(initialShow);


  let handleInputChange = e => {
    let { name, value } = e.target;
    setItem(state => ({
     ...state, [name]: value
    }));
  };

  let addItem = (e) => {

    e.preventDefault();
    e.target.reset();

    item['_id']=uuid();
    item['complete'] = false;
    
    setToDolist(state => ([...todoList, item]));
    setItem(()=> ({}));

  };

  let deleteItem = id => {
    let newList = todoList.filter(item => item._id !== id)
    setToDolist(newList);
  };

  let toggleComplete = id => {
    setToDolist(
      todoList.map(item =>
        item._id === id ? {
          ...item,
          complete: !item.complete,
        } :item
      )
    )
  };

  let toggleDetails = id => {
    let toggledItem = todoList.find(item => item._id === id);
    setDetails(toggledItem || {});
    setShowDetails(!!toggledItem);
  }

  return (
    <>
      <Header 
        todoList={todoList}
      />
      <section className="todo">

        <Form
         addItem={addItem}
         handleInputChange={handleInputChange}
        />
        <List
        todoList={todoList}
        toggleComplete={toggleComplete}
        toggleDetails={toggleDetails}
        deleteItem={deleteItem}
        />
      </section>
      <When condition={showDetails}>
        <Modal title="To Do Item" close={toggleDetails}>
          <div className="todo-details">
            <header>
              <span>Assigned To: {details.assignee}</span>
              <span>Due: {details.due}</span>
            </header>
            <div className="item">
              {details.text}
            </div>
          </div>
        </Modal>
      </When>
    </>
  );
}
