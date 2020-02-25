import React from 'react';

class EditItemForm extends React.Component {
  handleChange = (event) => {
    // Update the Item
    // 1. Take a copy of current Item
    const updatedItem = { ...this.props.item, [event.currentTarget.name]: event.currentTarget.value };
    this.props.updateItem(this.props.index, updatedItem);
  }

  render() {
    return <div className="item-edit">
      <input type="text" name="name" onChange={this.handleChange} value={this.props.item.name} />
      <input type="text" name="price" onChange={this.handleChange} value={this.props.item.price} />
      <select type="text" name="status" onChange={this.handleChange} value={this.props.item.status} >
        <option value="available">Fresh!</option>
        <option value="unavailable">Sold Out!</option>
      </select>
      <textarea name="desc" onChange={this.handleChange} value={this.props.item.desc} ></textarea>
      <input type="text" name="image" onChange={this.handleChange} value={this.props.item.image} />
      <button onClick={() => this.props.deleteItem(this.props.index)}>Remove Item</button>
    </div>
  }
}

export default EditItemForm;