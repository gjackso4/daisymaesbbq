import React from 'react';
import AddItemForm from './addItem';
import EditItemForm from './EditItemForm';
import Login from './Login';
import firebase from 'firebase';
import base, { firebaseApp } from '../base';

class Inventory extends React.Component {

  state = {
    uid: null,
    owner: null
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler({ user });
      }
    })
  }

  authHandler = async (authData) => {
    //1. Look up the current store in firebase database
    const store = await base.fetch('owner', { context: this });
    //2. Claim it if there is no owner
    if (!store.owner) {
      await base.post('/owner', {
        data: authData.user.uid
      });
    }
    //3. Set the state of the inventory component to reflect current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid
    })
  };

  authenticate = () => {
    const authProvider = new firebase.auth.FacebookAuthProvider();
    firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
  };

  logout = async () => {
    await firebase.auth().signOut();
    this.setState({ uid: null });
  }


  render() {
    const logout = <button onClick={this.logout}>Log Out</button>;

    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />
    }

    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you are not the owner!</p>
          {logout}
        </div>
      );
    }

    return (
      <div className="inventory">
        <h2>Inventory!!!</h2>
        {logout}
        {Object.keys(this.props.items).map(key => <EditItemForm key={key} item={this.props.items[key]} updateItem={this.props.updateItem} deleteItem={this.props.deleteItem} index={key} />)}
        <AddItemForm addItem={this.props.addItem} />
        <button onClick={this.props.loadSample}>Load Sample Items</button>
      </div>
    )

  }
}

export default Inventory;