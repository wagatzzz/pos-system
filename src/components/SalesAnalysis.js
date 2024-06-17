import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Bar } from 'react-chartjs-2';
import { onAuthStateChanged } from 'firebase/auth';
import 'chart.js/auto';

const SalesAnalysis = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [mostSoldItem, setMostSoldItem] = useState(null);
  const [highestQuantityItem, setHighestQuantityItem] = useState(null);
  const [lowestQuantityItem, setLowestQuantityItem] = useState(null);
  const [highestPriceItem, setHighestPriceItem] = useState(null);
  const [lowestPriceItem, setLowestPriceItem] = useState(null);
  const [zeroQuantityItems, setZeroQuantityItems] = useState([]);
  const [itemsInStock, setItemsInStock] = useState(0);

  useEffect(() => {
    const fetchSalesData = async (userId) => {
      try {
        const q = query(collection(db, 'sales'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const salesList = querySnapshot.docs.map(doc => doc.data());
        setSalesData(salesList);
      } catch (error) {
        console.error('Error fetching sales data: ', error);
      }
    };

    const fetchItemsData = async () => {
      try {
        const itemsQuery = query(collection(db, 'items'), where('userId', '==', userId));
        const querySnapshot = await getDocs(itemsQuery);
        const itemsList = querySnapshot.docs.map(doc => doc.data());

        const highestQuantityItem = itemsList.reduce((max, item) => item.quantity > max.quantity ? item : max, itemsList[0]);
        const lowestQuantityItem = itemsList.reduce((min, item) => item.quantity < min.quantity ? item : min, itemsList[0]);
        const highestPriceItem = itemsList.reduce((max, item) => item.price > max.price ? item : max, itemsList[0]);
        const lowestPriceItem = itemsList.reduce((min, item) => item.price < min.price ? item : min, itemsList[0]);

        const zeroQuantityItems = itemsList.filter(item => item.quantity === 0);
        const itemsInStock = itemsList.filter(item => item.quantity > 0).length;

        setHighestQuantityItem(highestQuantityItem);
        setLowestQuantityItem(lowestQuantityItem);
        setHighestPriceItem(highestPriceItem);
        setLowestPriceItem(lowestPriceItem);
        setZeroQuantityItems(zeroQuantityItems);
        setItemsInStock(itemsInStock);
      } catch (error) {
        console.error('Error fetching items data: ', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchSalesData(user.uid);
        fetchItemsData(user.uid);
      } else {
        setSalesData([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const aggregateQuantities = useCallback(() => {
    const quantities = {};

    salesData.forEach(sale => {
      sale.items.forEach(item => {
        if (quantities[item.name]) {
          quantities[item.name] += item.quantity;
        } else {
          quantities[item.name] = item.quantity;
        }
      });
    });

    return quantities;
  }, [salesData]);

  useEffect(() => {
    if (salesData.length > 0) {
      const quantities = aggregateQuantities();
      const mostSoldItemName = Object.keys(quantities).reduce((a, b) => quantities[a] > quantities[b] ? a : b);
      setMostSoldItem(mostSoldItemName);
    }
  }, [salesData, aggregateQuantities]);

  const quantities = aggregateQuantities();

  const data = {
    labels: Object.keys(quantities),
    datasets: [
      {
        label: 'Quantity Sold',
        data: Object.values(quantities),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          },
        },
      },
    },
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-6xl bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sales Analysis</h1>
        <Bar data={data} options={options} />
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <p>Most Sold Item: {mostSoldItem}</p>
          <p>Item with Highest Quantity in Stock: {highestQuantityItem?.name} ({highestQuantityItem?.quantity})</p>
          <p>Item with Lowest Quantity in Stock: {lowestQuantityItem?.name} ({lowestQuantityItem?.quantity})</p>
          <p>Item with Highest Price: {highestPriceItem?.name} (KSH {highestPriceItem?.price})</p>
          <p>Item with Lowest Price: {lowestPriceItem?.name} (KSH {lowestPriceItem?.price})</p>
          <p>Number of Items in stock: {itemsInStock}</p>
          <h3 className="text-lg font-bold mt-4">Items with 0 Quantity:</h3>
          {zeroQuantityItems.length > 0 ? (
            <ul>
              {zeroQuantityItems.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          ) : (
            <p>No items with 0 quantity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysis;
