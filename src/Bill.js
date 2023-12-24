import { useRef, useState, useEffect } from 'react';
import {Html5QrcodeScanner} from "html5-qrcode";

function Bill(){
	let [items, setItems] = useState([]);
	let scanner = useRef();

	function addItem(itemId, name, price){
		setItems((prev)=>{
			let updatedItems = [...prev];
			let index = prev.findIndex(item => item.itemId === itemId);
			if(index === -1){
				updatedItems.push({
					"itemId": itemId,
					"name": name,
					"price": price,
					"quantity": 1
				});
			}else{
				updatedItems[index].quantity++;
			}
			return updatedItems;
		})
	}

	function removeOneItem(itemId) {
		setItems((prev)=>{
			let updatedItems = [...prev];
			let index = updatedItems.findIndex(item => item.itemId === itemId);
			if(index > -1){
				updatedItems[index].quantity--;
				if(updatedItems[index].quantity <= 0)
					updatedItems.splice(index, 1);
			}
			return updatedItems;
		})
	}

	// Scanner Function
	useEffect(() => {
	    let html5QrcodeScanner = null;

	    const initializeScanner = async () => {
	      html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);

	      // Optional: Set a callback function to handle scanned results
	      html5QrcodeScanner.render((decodedText) => {
			let item=JSON.parse(decodedText);
			addItem(parseInt(item.itemId), item.name, parseInt(item.price));
			scanner.current.pause(true);
			});

	      scanner.current = html5QrcodeScanner;
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
				<button onClick={()=>{scanner.current.resume()}}> Add Items </button>
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