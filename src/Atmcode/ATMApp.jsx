import React, { useState } from 'react';
import { AlertCircle, DollarSign, CreditCard, History, ArrowRightLeft } from 'lucide-react';

const API_BASE = 'https://atmapplication-backend.onrender.com/api/atm';

export default function ATMApp() {
  const [view, setView] = useState('login');
  const [account, setAccount] = useState('');
  const [pin, setPin] = useState('');
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');


  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/accounts/${account}/balance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pin: pin
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      setBalance(Number(data));
      setView('menu');
      showMessage('success', 'Login successful!');

    } catch (err) {
      console.error(err);
      showMessage('error', err.message || 'Connection error');
    }
  };



  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_BASE}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber: account,
          ownerName: ownerName,
          pin: pin,
          initialBalance: Number(initialBalance)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      showMessage('success', 'Account created successfully! Please login.');
      setView('login');

      // cleanup
      setAccount('');
      setOwnerName('');
      setPin('');
      setInitialBalance('');

    } catch (err) {
      showMessage('error', err.message);
    }
  };



  const handleDeposit = async () => {
    try {
      const res = await fetch(`${API_BASE}/accounts/${account}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          amount: Number(amount)
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Deposit failed');
      }

      const data = await res.json();

      // ✅ Extract balance from Transaction object
      const newBalance = Number(data.account.balance);

      if (Number.isNaN(newBalance)) {
        throw new Error('Invalid balance received from server');
      }

      setBalance(newBalance);

      showMessage('success', `Deposited ₹${amount} successfully!`);
      setAmount('');
      setView('menu');

    } catch (err) {
      console.error(err);
      showMessage('error', err.message || 'Transaction failed');
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/accounts/${account}/withdraw`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pin: pin,
            amount: Number(amount)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Withdrawal failed');
      }

      const newBalance = Number(data.account.balance);

      if (Number.isNaN(newBalance)) {
        throw new Error('Invalid balance received');
      }

      setBalance(newBalance);
      showMessage('success', `Withdrew ₹${amount} successfully!`);
      setAmount('');
      setView('menu');

    } catch (err) {
      console.error(err);
      showMessage('error', err.message || 'Transaction failed');
    }
  };

  const handleLogout = () => {
  // clear sensitive state
  setAccount('');
  setPin('');
  setBalance(null);
  setTransactions([]);
  setAmount('');
  setToAccount('');
  setMessage({ type: '', text: '' });

  // go back to login screen
  setView('login');
};


  const handleTransfer = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/accounts/${account}/transfer/${toAccount}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pin: pin,
            amount: Number(amount)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Transfer failed');
      }

      // normalize BigDecimal → JS number
      const newBalance = Number(data?.balance ?? data?.account?.balance);

      setBalance(Number.isFinite(newBalance) ? newBalance : 0);

      showMessage('success', `Transferred ₹${amount} successfully!`);
      setAmount('');
      setToAccount('');
      setView('menu');

    } catch (err) {
      console.error(err);
      showMessage('error', err.message || 'Transaction failed');
    }
  };



  const handleViewTransactions = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/accounts/${account}/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pin: pin
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load transactions');
      }

      setTransactions(data);
      setView('transactions');

    } catch (err) {
      console.error(err);
      showMessage('error', err.message || 'Failed to load transactions');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            ATM System
          </h1>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`mb-4 p-3 rounded flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              <AlertCircle className="w-5 h-5" />
              {message.text}
            </div>
          )}

          {view === 'login' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Welcome</h2>

              <input
                type="text"
                placeholder="Account Number"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />

              <input
                type="password"
                placeholder="PIN"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold"
              >
                Login
              </button>

              <div className="text-center text-sm text-gray-600">
                Don’t have an account?
              </div>

              <button
                onClick={() => setView('signup')}
                className="w-full border border-blue-600 text-blue-600 p-3 rounded hover:bg-blue-50 font-semibold"
              >
                Create New Account
              </button>
            </div>
          )}


          {view === 'signup' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Create Account</h2>

              <input
                type="text"
                placeholder="Account Number"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full p-3 border rounded"
              />

              <input
                type="text"
                placeholder="Owner Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-3 border rounded"
              />

              <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-3 border rounded"
              />

              <input
                type="number"
                placeholder="Initial Balance"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full p-3 border rounded"
              />

              <button
                onClick={handleSignup}
                className="w-full bg-green-600 text-white p-3 rounded"
              >
                Create Account
              </button>

              <button
                onClick={() => setView('login')}
                className="w-full bg-gray-500 text-white p-3 rounded"
              >
                Back to Login
              </button>
            </div>
          )}



          {view === 'menu' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-3xl font-bold text-blue-600">${balance?.toFixed(2)}</p>
              </div>

              <button
                onClick={() => setView('deposit')}
                className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Deposit
              </button>

              <button
                onClick={() => setView('withdraw')}
                className="w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Withdraw
              </button>

              <button
                onClick={() => setView('transfer')}
                className="w-full bg-purple-500 text-white p-3 rounded hover:bg-purple-600 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-5 h-5" />
                Transfer
              </button>

              <button
                onClick={handleViewTransactions}
                className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <History className="w-5 h-5" />
                Transaction History
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}

          {view === 'deposit' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Deposit Money</h2>
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeposit}
                  className="flex-1 bg-green-500 text-white p-3 rounded hover:bg-green-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => { setView('menu'); setAmount(''); }}
                  className="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {view === 'withdraw' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Withdraw Money</h2>
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-orange-500 text-white p-3 rounded hover:bg-orange-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => { setView('menu'); setAmount(''); }}
                  className="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {view === 'transfer' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Transfer Money</h2>
              <input
                type="text"
                placeholder="To Account Number"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleTransfer}
                  className="flex-1 bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => { setView('menu'); setAmount(''); setToAccount(''); }}
                  className="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {view === 'transactions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No transactions found</p>
                ) : (
                  transactions.map((txn, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{txn.type}</p>
                          <p className="text-sm text-gray-600">{new Date(txn.timestamp).toLocaleString()}</p>
                        </div>
                        <p className={`font-bold ${txn.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {txn.type === 'DEPOSIT' ? '+' : '-'}${txn.amount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setView('menu')}
                className="w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}