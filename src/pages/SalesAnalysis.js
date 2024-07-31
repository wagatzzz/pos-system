import React, { useEffect, useState, useCallback } from 'react';
import { fetchSales, fetchItems } from '../services/firebaseServices';
import { Bar } from 'react-chartjs-2';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
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
        const salesList = await fetchSales(userId);
        setSalesData(salesList);
      } catch (error) {
        console.error('Error fetching sales data: ', error);
      }
    };

    const fetchItemsData = async () => {
      try {
        const itemsList = await fetchItems(userId);

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
        backgroundColor: 'rgba(46, 204, 113, 0.6)', // emerald-700 color
        borderColor: 'rgba(46, 204, 113, 1)', // emerald-700 color
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-emerald-700">Sales Analysis</h1>
        <Bar data={data} options={options} />
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-emerald-700">Statistics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-medium text-gray-800">
                Most Sold Item: <span className="text-emerald-700">{mostSoldItem}</span>
              </p>
              <p className="text-lg font-medium text-gray-800">
                Item with Highest Quantity in Stock: <span className="text-emerald-700">{highestQuantityItem?.name} ({highestQuantityItem?.quantity})</span>
              </p>
              <p className="text-lg font-medium text-gray-800">
                Item with Lowest Quantity in Stock: <span className="text-emerald-700">{lowestQuantityItem?.name} ({lowestQuantityItem?.quantity})</span>
              </p>
              <p className="text-lg font-medium text-gray-800">
                Number of Items in Stock: <span className="text-emerald-700">{itemsInStock}</span>
              </p>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-800">
                Item with Highest Price: <span className="text-emerald-700">{highestPriceItem?.name} (KSH {highestPriceItem?.price})</span>
              </p>
              <p className="text-lg font-medium text-gray-800">
                Item with Lowest Price: <span className="text-emerald-700">{lowestPriceItem?.name} (KSH {lowestPriceItem?.price})</span>
              </p>
              <h3 className="text-xl font-bold mt-4 text-emerald-700">Items with 0 Quantity:</h3>
              {zeroQuantityItems.length > 0 ? (
                <ul className="list-disc pl-4">
                  {zeroQuantityItems.map((item, index) => (
                    <li key={index} className="text-lg font-medium text-gray-800">
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg font-medium text-gray-800">No items with 0 quantity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysis;
