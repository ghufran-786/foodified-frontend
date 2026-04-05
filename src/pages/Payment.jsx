import React, { useState, useMemo, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../UserContext";
import { paymentAPI } from "../services/paymentAPI";
import { clearCart } from "../redux/cartSlice";

// Payment method types
const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'netbanking'
};

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userEmail } = useContext(dataContext);
  const items = useSelector((state) => state.cart.itemsList);

  // Payment state
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS.CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form data
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Calculate amounts
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );
  const gstAmount = useMemo(() => parseFloat((subtotal * 0.05).toFixed(2)), [subtotal]);
  const totalAmount = useMemo(() => subtotal + gstAmount, [subtotal, gstAmount]);

  // Validation functions
  const validateCardData = () => {
    const { cardNumber, expiryDate, cvv, cardHolderName } = cardData;

    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      return "Please enter a valid 16-digit card number";
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return "Please enter expiry date in MM/YY format";
    }
    if (!cvv || cvv.length !== 3) {
      return "Please enter a valid 3-digit CVV";
    }
    if (!cardHolderName || cardHolderName.trim().length < 2) {
      return "Please enter card holder name";
    }
    return null;
  };

  const validateUpiData = () => {
    if (!upiId || !upiId.includes('@')) {
      return "Please enter a valid UPI ID (e.g., user@paytm)";
    }
    return null;
  };

  const validateNetBankingData = () => {
    if (!selectedBank) {
      return "Please select a bank";
    }
    return null;
  };

  // Handle payment submission
  const handlePayment = async () => {
    setErrorMessage("");
    setStatusMessage("");

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Add items before paying.");
      return;
    }

    // Validate based on payment method
    let validationError = null;
    if (selectedMethod === PAYMENT_METHODS.CARD) {
      validationError = validateCardData();
    } else if (selectedMethod === PAYMENT_METHODS.UPI) {
      validationError = validateUpiData();
    } else if (selectedMethod === PAYMENT_METHODS.NET_BANKING) {
      validationError = validateNetBankingData();
    }

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call backend to simulate payment
      const paymentData = {
        amount: Math.round(totalAmount * 100), // Convert to paisa
        currency: 'inr',
        method: selectedMethod,
        paymentDetails: selectedMethod === PAYMENT_METHODS.CARD ? cardData :
                       selectedMethod === PAYMENT_METHODS.UPI ? { upiId } :
                       { bank: selectedBank }
      };

      const result = await paymentAPI.processPayment(paymentData);

      if (result.success) {
        setStatusMessage(`Payment Successful ✅\nTransaction ID: ${result.transactionId}`);
        dispatch(clearCart());

        // Redirect after success
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setErrorMessage(result.message || "Payment Failed ❌, please try again");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("Payment Failed ❌, please try again");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle card input changes
  const handleCardInputChange = (field, value) => {
    if (field === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardData(prev => ({ ...prev, [field]: formatted }));
    } else if (field === 'expiryDate') {
      // Format expiry date
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0, 5);
      setCardData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setCardData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your order with confidence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Payment Details</h2>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod(PAYMENT_METHODS.CARD)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === PAYMENT_METHODS.CARD
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center">
                      {selectedMethod === PAYMENT_METHODS.CARD && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">Visa, MasterCard, RuPay</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod(PAYMENT_METHODS.UPI)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === PAYMENT_METHODS.UPI
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center">
                      {selectedMethod === PAYMENT_METHODS.UPI && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">UPI</div>
                      <div className="text-sm text-gray-500">Paytm, Google Pay, PhonePe</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod(PAYMENT_METHODS.NET_BANKING)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === PAYMENT_METHODS.NET_BANKING
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center">
                      {selectedMethod === PAYMENT_METHODS.NET_BANKING && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Net Banking</div>
                      <div className="text-sm text-gray-500">Online banking transfer</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Method Forms */}
            {selectedMethod === PAYMENT_METHODS.CARD && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength="19"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardData.cardHolderName}
                    onChange={(e) => handleCardInputChange('cardHolderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedMethod === PAYMENT_METHODS.UPI && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="user@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your UPI ID (e.g., mobile@paytm, user@okicici)
                </p>
              </div>
            )}

            {selectedMethod === PAYMENT_METHODS.NET_BANKING && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="pnb">Punjab National Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Success Message */}
            {statusMessage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <pre className="text-green-700 text-sm whitespace-pre-line">{statusMessage}</pre>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full mt-6 py-3 px-4 rounded-md font-semibold text-white transition-all ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay Rs. ${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (5%)</span>
                <span className="font-medium">Rs. {gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-6 py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
