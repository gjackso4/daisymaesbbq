import React from 'react';
import { formatPrice } from '../helpers';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


class Order extends React.Component {


  placeOrder = (total, items) => {
    // Publishable Key from Stripe Dashboard
    const stripe = window.Stripe('pk_test_wBzurxpl5PktrQsfbRXY2yvX007p2GTShY');
    const paymentBtn = document.getElementById('stripe-payment-btn');
    let sessionId;
    let orderData = {
      currency: 'USD',
      quantity: 1,
      amount: total,
      name: items,
      image: 'https://daisymaebbq.com/images/logo.jpg'
    }
    // Url to Firebase function
    fetch('https://us-central1-daisymae-bbq.cloudfunctions.net/createOrderAndSession', {
      method: 'POST',
      // Adding the order data to payload
      body: JSON.stringify(orderData)
    }).then(response => {
      return response.json();
    }).then(data => {
      // Getting the session id from firebase function
      var body = JSON.parse(data.body);
      return sessionId = body.sessionId;
    }).then(sessionId => {
      // Redirecting to payment form page
      stripe.redirectToCheckout({
        sessionId: sessionId
      }).then(function (result) {
        result.error.message
      });
    });

  }



  renderOrder = (key) => {
    const item = this.props.item[key];
    const count = this.props.order[key];

    // Make sure Item is loaded before we continue
    if (!item) return null;

    const isAvailable = item.status === 'available';

    if (!isAvailable) {
      return <CSSTransition classNames="order" key={key} timeout={{ enter: 500, exit: 500 }}>
        <li key={key}>Sorry {item ? item.name : 'item'} is no longer available</li>
      </CSSTransition>
    }

    return <CSSTransition classNames="order" key={key} timeout={{ enter: 500, exit: 500 }}>
      <li key={key}>
        <span className="right-align">
          <span>
            <TransitionGroup component="span" className="count">
              <CSSTransition classNames="count" key={count} timeout={{ enter: 500, exit: 500 }}>
                <span>{count}</span>
              </CSSTransition>
            </TransitionGroup>
            &nbsp;x {item.name}
          </span>
          <span>
            {formatPrice(count * item.price)}
            <button onClick={() => this.props.deleteOrder(key)}>X</button>
          </span>
        </span>
      </li></CSSTransition>;

  }



  render() {

    const orderIds = Object.keys(this.props.order);


    const total = orderIds.reduce((prevTotal, key) => {
      const item = this.props.item[key];
      const count = this.props.order[key];



      const isAvailable = item && item.status === 'available';
      if (isAvailable) {
        return prevTotal + (count * item.price);
      } else {
        return prevTotal;
      }
    }, 0);

    const itemList = orderIds.reduce((prevArray, key) => {
      const item = this.props.item[key];
      const count = this.props.order[key];

      const isAvailable = item && item.status === 'available';
      if (isAvailable) {
        return prevArray + (`${count} ${item.name}, `);
      } else {
        return prevArray;
      }
    }, '');


    return (
      <div className="order-wrap">
        <h2>Order</h2>
        <TransitionGroup component="ul" className="order">
          {orderIds.map(this.renderOrder)}
        </TransitionGroup>

        <div className="total">
          Total:
          <span>
            <strong>{formatPrice(total)}</strong>
          </span>
        </div>
        <br />
        <button disabled={!itemList} id="stripe-payment-btn" onClick={() => this.placeOrder(total, itemList)}>Checkout with Credit Card</button>
      </div>
    )
  }
}

export default Order;