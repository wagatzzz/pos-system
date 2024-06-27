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
    return <p className="text-center text-lg text-gray-700">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-emerald-700 text-center">Sales By Date</h1>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="mb-6 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sales on {selectedDate.toDateString()}</h2>
          {sales.length > 0 ? (
            <ul className="space-y-4">
              {sales.map((sale, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="mb-4">
                    <p className="font-semibold text-gray-800">Customer Name: <span className="text-emerald-700">{sale.customerName}</span></p>
                    <p className="font-semibold text-gray-800">Customer Number: <span className="text-emerald-700">{sale.customerNumber}</span></p>
                    <p className="font-semibold text-gray-800">Payment Method: <span className="text-emerald-700">{sale.paymentMethod}</span></p>
                    <p className="font-semibold text-gray-800">Total Amount: <span className="text-emerald-700">KSH {sale.total}</span></p>
                  </div>
                  <ul className="pl-4 border-l-2 border-gray-300">
                    {sale.items.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        <p className="text-gray-700">Item Name: <span className="text-emerald-700 font-medium">{item.name}</span></p>
                        <p className="text-gray-700">Price: <span className="text-emerald-700 font-medium">KSH {item.price}</span></p>
                        <p className="text-gray-700">Quantity: <span className="text-emerald-700 font-medium">{item.quantity}</span></p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No sales found for this date.</p>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">Total Amount: <span className="text-emerald-700">KSH {totalAmount}</span></h2>
        </div>
      </div>
    </div>
  );
};

export default SalesByDate;
