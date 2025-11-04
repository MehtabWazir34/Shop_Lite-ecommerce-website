import { DataBases, account} from '../Auth/Config';
import {  ID } from 'appwrite';


export const handlePlaceOrder = async ({product, total, address})=> {
  try {
    const user = await account.get(); // Get logged-in user info

      let order = await DataBases.createDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_OrderCollection_ID,
      ID.unique(),
      {
        userId: user.$id,
        productId: product.id,
        quantity: product.qty || 1,
        total: total,
        address: `${address.name}, ${address.phone}, ${address.address}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    )

    console.log(' Order saved:', order);
    alert('Order placed successfully!');
  } catch (error) {
    console.error('Error saving order:', error);
    alert('Failed to place order.');
  }
}
