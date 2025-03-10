import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, BarChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Pie, Cell } from "recharts";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
const colors = ["#8884d8", "#82ca9d", "#ffc658"];
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  // const [user, setUser] = useState(authUser?.username || "User");
  const [transactions, setTransactions] = useState([]);
  const [frequency, setFrequency] = useState("3");
  const [type, setType] = useState("All");
  const [chartView, setChartView] = useState("line");
  const [modalOpen, setModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    title: "",
    amount: "",
    transactionType: "income",
    category: "",
  });
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }
    
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch transactions when filters change
  useEffect(() => {
    if (authUser?._id) {
      fetchTransactions();
    }
  }, [authUser?._id, frequency, type]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/transactions/getTransaction`, {
        params: { 
          userId: authUser._id, 
          frequency: frequency !== "all" ? frequency : undefined, // Only send if not "all"
          type: type !== "All" ? type : undefined // Only send if not "All"
        }
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  
  

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user")); // Retrieve user from session storage
      const userId = user?._id; // Extract userId
  
      if (!userId) {
        alert("User not found. Please log in again.");
        return;
      }
  
      // Add userId to the transaction object
      const transaction = { ...newTransaction, userId };
  
      console.log("Final Transaction Data Sent to API:", transaction); // Debugging
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/addTransaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
  
      const data = await response.json();
      console.log("Response received:", data); // Debugging
  
      if (response.ok) {
        alert("Transaction added successfully!");
        setModalOpen(false);
      } else {
        alert(data.message || "Failed to add transaction.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };
  


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div className="dashboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="dashboard-header">
      <h2>Welcome, {user ? user.name : " "}</h2>
      </div>

      <div className="dashboard-filters card">
        <div className="row">
          <div className="col-md-3 mb-2">
            <label>Frequency</label>
            <select className="form-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <label>Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="All">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <label>Chart View</label>
            <select className="form-select" value={chartView} onChange={(e) => setChartView(e.target.value)}>
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={() => setModalOpen(true)}>Add New</button>
          </div>
        </div>
      </div>


{/* Chart Section */}
  <div className="dashboard-graph card">
        <h5>Analytics Overview</h5>
        <div style={{ width: "100%", height: "300px", display: "flex", justifyContent: "center" }}>
          {chartView === "line" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
    dataKey="date" 
    tickFormatter={(date) => new Date(date).toISOString().split("T")[0]} 
  />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
          {chartView === "bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="transactionType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {chartView === "pie" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={transactions} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
                  {transactions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="dashboard-table card">
        <h5>Transactions</h5>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.date).toISOString().split("T")[0]}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.category}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button className="btn btn-danger fixed-logout" onClick={handleLogout}>
        Logout
      </button>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Personal Finance Manager. All rights reserved.</p>
      </footer>

      {modalOpen && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Add New Transaction</h5>
              <button className="btn btn-danger" onClick={() => setModalOpen(false)}>X</button>
            </div>
            <div className="modal-body">
              <input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} placeholder="Date" />
              <input type="text" name="title" value={newTransaction.title} onChange={handleInputChange} placeholder="Title" />
              <input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} placeholder="Amount" />
              <select name="transactionType" value={newTransaction.transactionType} onChange={handleInputChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input type="text" name="category" value={newTransaction.category} onChange={handleInputChange} placeholder="Category" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleAddTransaction}>Add</button>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
