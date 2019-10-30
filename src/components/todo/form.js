import React from 'react';

import useSettings from '../settings/hook';

export default function Form(props){
  const settings = useSettings();

  let shownNumber = e =>{
    settings.setNumber(e.target.value); 
  }
  console.log(settings.numberOfItems);
  return(
    <div>
    <h3>Add Item</h3>
    <form onSubmit={props.addItem}>
      <label>
        <span>To Do Item</span>
        <input
          name="text"
          placeholder="Add To Do List Item"
          onChange={props.handleInputChange}
        />
      </label>
      <label>
        <span>Difficulty Rating</span>
        <input type="range" min="1" max="5" name="difficulty" defaultValue="3" onChange={props.handleInputChange} />
      </label>
      <label>
        <span>Assigned To</span>
        <input type="text" name="assignee" placeholder="Assigned To" onChange={props.handleInputChange} />
      </label>
      <label>
        <span>Due</span>
        <input type="date" name="due" onChange={props.handleInputChange} />
      </label>
      <button>Add Item</button>
    </form>
    <label>
      Results Shown
    <input type="number" onChange={shownNumber}></input>
    </label>
  </div>
  )
};
