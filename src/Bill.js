import { useRef, useState, useEffect } from 'react';
import {Html5QrcodeScanner} from "html5-qrcode";

function Bill(){
	let itemId_ref = useRef();
	let name_ref = useRef();
	let price_ref = useRef();
	let [items, setItems] = useState([]);
	let [scanner, setScanner] = useState([]);

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

	// Scanner Function
	// Define the callback function for successful scans
	const onScanSuccess = (decodedText, decodedResult) => {
		let item=JSON.parse(decodedText)
		addItem(parseInt(item.itemId), item.name, parseInt(item.price));
		window.html5QrcodeScanner.pause(true);
	};
	useEffect(() => {
	    let html5QrcodeScanner = null;

	    const initializeScanner = async () => {
	      html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);

	      // Optional: Set a callback function to handle scanned results
	      html5QrcodeScanner.render(onScanSuccess);

	      setScanner(html5QrcodeScanner);

	      window.html5QrcodeScanner = html5QrcodeScanner;
	    };

	    initializeScanner();

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
				<button onClick={()=>{window.html5QrcodeScanner.resume()}}> Add Items </button>
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