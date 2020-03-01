import React from 'react';
import Header from './Header'
import Order from './Order'
import items from '../sample-data'
import Item from './Item'
import base from '../base'

class App extends React.Component {

  //state
  state = {
    items: {},
    order: {}
  };

  componentDidMount() {
    // First reinstate our local storage
    const localStorageRef = localStorage.getItem('daisymaes-bbq');
    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }
    this.ref = base.syncState(`items`, {
      context: this,
      state: 'items'
    });
  }

  componentDidUpdate() {
    localStorage.setItem('daisymaes-bbq', JSON.stringify(this.state.order));
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addItem = (item) => {
    //1. Take a copy of existing state
    const items = { ...this.state.items };

    //2. Add new Item to that Items var
    items[`item${Date.now()}`] = item;

    //3. set the new Item object to state
    this.setState({
      items: items
    });
  };

  updateItem = (key, updatedItem) => {
    const items = { ...this.state.items };
    // update state
    items[key] = updatedItem;
    // update state
    this.setState({ items });
  }

  deleteItem = (key) => {
    //copy state
    const items = { ...this.state.items };
    //update state
    items[key] = null;
    //update state
    this.setState({ items });
  }

  deleteOrder = (key) => {
    const order = { ...this.state.order };
    delete order[key];
    this.setState({ order });

  }

  loadSample = () => {
    this.setState({ items: items });
  }

  addToOrder = (key) => {
    //1. Take a copy of existing state
    const order = { ...this.state.order };
    //2. Add to order or update order ammount
    order[key] = order[key] + 1 || 1;
    //3. call setState to update or state object
    this.setState({
      order: order
    })
  }

  render() {
    return (
      <div className="daisy-maes">
        <div className="menu">
          <Header />
          <ul className="items">
            {Object.keys(this.state.items).map(key =>
              <Item
                key={key}
                index={key}
                details={this.state.items[key]}
                addToOrder={this.addToOrder}

              />
            )}
          </ul>
        </div>
        <Order item={this.state.items} order={this.state.order} deleteOrder={this.deleteOrder} />
      </div>
    )
  }
}

export default App;