import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

// Controller to add a new transaction
export const addTransaction = async (req, res) => {
  try {
    const { date, title, amount, transactionType, category, userId } = req.body;

    // Check for missing fields
    if (!date || !title || !amount || !transactionType || !category || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    console.log("🔹 Received transaction data:", req.body); 
    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Ensure transactions array is initialized
    if (!user.transactions) {
      user.transactions = []; 
    }

    // Create new transaction
    const newTransaction = new Transaction({
      date: new Date(date),
      title,
      amount,
      transactionType,
      category,
      user: userId,
    });

    await newTransaction.save();

    // Associate transaction with user
    user.transactions.push(newTransaction._id);
    await user.save();

    console.log("Transaction successfully added:", newTransaction);

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully.",
      transaction: newTransaction,
    });
  } catch (err) {
    console.error("Error adding transaction:", err); 
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};



// Controller to fetch all transactions based on filters
export const getTransaction = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.query; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const query = { user: userId };

    if (type && type !== "all") {
      query.transactionType = type;
    }

    if (frequency && frequency !== "custom") {
      query.date = { $gt: moment().subtract(Number(frequency), "days").toDate() };
    } else if (startDate && endDate) {
      query.date = { $gte: moment(startDate).toDate(), $lte: moment(endDate).toDate() };
    }

    const transactions = await Transaction.find(query);

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};


// Controller to delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    user.transactions = user.transactions.filter(
      (transaction) => transaction._id.toString() !== transactionId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// Controller to update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { title, amount, date, category, transactionType } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    if (title) transaction.title = title;
    if (amount) transaction.amount = amount;
    if (date) transaction.date = date;
    if (category) transaction.category = category;
    if (transactionType) transaction.transactionType = transactionType;

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};
