import { useRef, useState } from 'react';

function Bill(){
	let itemId_ref = useRef();
	let name_ref = useRef();
	let price_ref = useRef();
	let [items, setItems] = useState([]);

	function addItem(itemId, name, price){
		let index = items.findIndex(item => item.itemId === itemId);
		let newItem = {
			"itemId": itemId,
			"name": name,
			"price": price,
			"quantity": 1
		}
		if(index === -1){
			setItems([...items, newItem])
		}else{
			let updatedItems = [...items];
			newItem.quantity+=items[index].quantity;
			updatedItems[index] = newItem;
			setItems(updatedItems);
		}
	}

	function removeOneItem(itemId) {
		let index = items.findIndex(item => item.itemId === itemId);
		if(index>-1){
			if(items[index].quantity === 1){
				let updatedItems = items.filter((_, i) => i !== index);
				setItems(updatedItems);
			}else{
				let updatedItems = [...items];
				updatedItems[index].quantity--;
				setItems(updatedItems);
			}
		}
	}

	return(
		<>
			<div>
				ItemId: <input type="number" ref={itemId_ref}/> <br />
				name: <input type="text" ref={name_ref}/> <br />
				price: <input type="number" ref={price_ref}/> <br />
				<button onClick={()=>addItem(itemId_ref.current.value, name_ref.current.value, price_ref.current.value)}> Add Items </button>
			</div>
			<div>
				<table>
					<thead>
						<tr>
							<th> ItemId </th>
							<th> Name </th>
							<th> Price </th>
							<th> Quantity </th>
							<th> Total Price </th>
							<th> Remove Item (1) </th>
						</tr>
					</thead>
					<tbody>
					{items.map((item, _) => (
				        <tr key={item.itemId}>
				        	<td> {item.itemId} </td>
				        	<td> {item.name} </td>
				        	<td> {item.price} </td>
				        	<td> {item.quantity} </td>
				        	<td> {item.price * item.quantity} </td>
				        	<td> <button onClick={()=>removeOneItem(item.itemId)} > Remove 1 Item </button> </td>
				        </tr>
			        ))}
			        </tbody>
				</table>
			</div>
		</>
	)
}

export default Bill;