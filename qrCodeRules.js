// to-qrcode.com
interface ProductInfo{
    /** @label ItemID */
    itemId: number;
    /** @label Name */
    name: string;
    /** @label Price */
    price: number;
}

defineRule((i: ProductInfo){
    let item = `{"itemId": ${i.itemId}, "name": "${i.name}", "price": ${i.price} }`;
    return item;
})