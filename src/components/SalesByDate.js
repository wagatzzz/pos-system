import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SalesByDate = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sales, setSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!userId) return;

      setLoading(true);

      // Get the start and end timestamps for the selected date
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      try {
        const q = query(
          collection(db, 'sales'),
          where('userId', '==', userId),
          where('timestamp', '>=', startDate),
          where('timestamp', '<', endDate)
        );

        const querySnapshot = await getDocs(q);

        const salesList = [];
        let total = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          salesList.push(data);
          total += data.total;
        });

        setSales(salesList);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching sales data: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSalesData();
    }
  }, [selectedDate, userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-6xl bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sales By Date</h1>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="mb-6 p-2 border rounded"
        />
        <div className="mb-6">
          <h2 className="text-xl font-bold">Sales on {selectedDate.toDateString()}</h2>
          {sales.length > 0 ? (
            <ul>
              {sales.map((sale, index) => (
                <li key={index} className="border-b py-2">
                  <p>Customer Name: {sale.customerName}</p>
                  <p>Customer Number: {sale.customerNumber}</p>
                  <p>Payment Method: {sale.paymentMethod}</p>
                  <p>Total Amount: KSH {sale.total}</p>
                  <ul>
                    {sale.items.map((item, idx) => (
                      <li key={idx} className="ml-4">
                        <p>Item Name: {item.name}</p>
                        <p>Price: KSH {item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No sales found for this date.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">Total Amount: KSH {totalAmount}</h2>
        </div>
      </div>
    </div>
  );
};

export default SalesByDate;
