import React from 'react';
import { formatPrice } from '../helpers';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import StripeCheckout from 'react-stripe-checkout';

class Order extends React.Component {

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

    const handleToken = (token, addresses) => {
      console.log(token),
        console.log(addresses)
    }

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
        <StripeCheckout stripeKey="pk_test_wBzurxpl5PktrQsfbRXY2yvX007p2GTShY" token={handleToken} billingAddress amount={total} />
      </div>
    )
  }
}

export default Order;