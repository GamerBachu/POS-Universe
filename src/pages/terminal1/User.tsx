import React, { useState } from 'react';
import { useTerminalDispatch, useTerminalState } from './TerminalContext';

type Props = {};

const User = (props: Props) => {
  const state = useTerminalState();
  const dispatch = useTerminalDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    dispatch({
      type: "SET_ALERT",
      alert: { type: "success", message: `Customer Linked: ${customer.name || 'Walk-in'}` }
    });
  };


  return (
    <>
      <div className="px-4 py-2 bg-gray-50/80 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-teal-500 text-gray-400 hover:text-teal-500 transition-all shadow-sm active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <div
            className="flex-1 cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
          >
            <p className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-teal-500 transition-colors">Customer</p>
            <p className="text-[12px] font-black text-gray-700 dark:text-gray-200 truncate">
              {customer.name || "Walk-in Customer"}
            </p>
          </div>
        </div>
      </div>
      {/* Customer Modal (Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-bold text-sm">Customer Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveCustomer} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Full Name</label>
                <input
                  autoFocus
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border rounded-md dark:border-gray-700 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Contact Number</label>
                <input
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border rounded-md dark:border-gray-700 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Enter phone"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-teal-600 text-white text-sm font-black rounded-md hover:bg-teal-700 transition-all shadow-lg active:scale-95">
                SAVE CUSTOMER
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default User;