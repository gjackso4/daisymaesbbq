import React from 'react';
import { formatPrice } from '../helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Item extends React.Component {

    handleClick = () => {

        this.props.addToOrder(this.props.index);
        toast.success("Added To Cart!");
    }

    render() {

        const { image, name, desc, status, price } = this.props.details;
        const isAvailable = status === 'available';



        return (
            <li className="menu-item">
                <img src={image} alt={name} />
                <h3 className="item-name">
                    {name}
                    <span className="price">{formatPrice(price)}</span>
                </h3>
                <p>{desc}</p>
                <button disabled={!isAvailable} onClick={this.handleClick} >{isAvailable ? 'Add To Order' : 'Sold Out!'}</button>
                <ToastContainer />
            </li>

        )
    }
}

export default Item;