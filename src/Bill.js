import React, { useRef, useState, useEffect } from 'react';
import {Html5QrcodeScanner} from "html5-qrcode";
import './Bill.css';

// TODO Remove window.items from the below.
function Bill(){
	let [ items, setItems ] = useState([]);
	let scanner = useRef(null);

	function addItem(itemId, name, price){
		let items = window.items;
		let index = items.findIndex(item => item.itemId === itemId);
		let newItem = {
			"itemId": itemId,
			"name": name,
			"price": price,
			"quantity": 1
		}
		let updatedItems = [];
		if(index < 0){
			updatedItems = [...items, newItem];
			setItems(updatedItems);
		}else{	
			updatedItems = [...items];
			newItem.quantity+=items[index].quantity;
			updatedItems[index] = newItem;
			setItems(updatedItems);
		}
		window.items = updatedItems;
	}

	function removeOneItem(itemId) {
		let items = window.items;
		let index = items.findIndex(item => item.itemId === itemId);
		if(index>-1){
			let updatedItems = [];
			if(items[index].quantity === 1){
				updatedItems = items.filter((_, i) => i !== index);
				setItems(updatedItems);
			}else{
				updatedItems = [...items];
				updatedItems[index].quantity--;
				setItems(updatedItems);
			}
			window.items = updatedItems;
		}
	}

	// Scanner Function
	// Define the callback function for successful scans
	const onScanSuccess = (decodedText, decodedResult) => {
		let item=JSON.parse(decodedText)
		addItem(item.itemId, item.name, parseInt(item.price));
		scanner.current.pause(true);
	};


	useEffect(() => {
	    let html5QrcodeScanner = null;

	    const initializeScanner = async () => {
	      html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);

	      // Optional: Set a callback function to handle scanned results
	      html5QrcodeScanner.render(onScanSuccess);

	      scanner.current = html5QrcodeScanner;
	    };
	    initializeScanner();

		window.items = items;

	    // Clean up the scanner when the component unmounts
	    return () => {
	      if (html5QrcodeScanner) {
	        html5QrcodeScanner.clear();
	      }
	    };
	}, []);

	return(
		<>
			<div>
				<div id="reader" width="600px"></div>
			</div>
			<div>
				<button className="add_btn" onClick={()=>{scanner.current.resume()}}> Add Items </button>
			</div>
			<div>
				<table className="table">
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
				        	<td> <button className="remove_btn" onClick={()=>removeOneItem(item.itemId)} > Remove 1 Item </button> </td>
				        </tr>
			        ))}
			        	<tr key="Result">
				        	<td>  </td>
				        	<td>  </td>
				        	<td>  </td>
				        	<td> { items.map((item) => item.quantity).reduce((sum, quantity) => sum + quantity, 0) } </td>
				        	<td> { items.map((item) => item.price * item.quantity).reduce((sum, price) => sum + price, 0) } </td>
				        	<td>  </td>
				        </tr>
			        </tbody>
				</table>
			</div>
		</>
	)
}

export default Bill;