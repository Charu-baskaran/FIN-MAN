import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    date: { type: Date, required: true }, 
    title: { type: String, required: true }, 
    amount: { type: Number, required: true }, 
    transactionType: { type: String, required: true, enum: ["income", "expense"] }, 
    category: { type: String, required: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    // createdAt: { type: Date, default: Date.now }, 
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
