import React, { useState } from "react";
import { IconRefresh } from "./UIComponents";

export default function LeadForm({ isOpen, onClose, onSubmit, isLightMode = false, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    intent: "",
    budgetMin: "",
    budgetMax: "",
    area: "",
    beds: "",
    timeline: ""
  });

  const intents = ["Buy", "Rent", "Invest"];
  const bedOptions = ["Studio", "1", "2", "3", "4+"];
  const timelineOptions = ["Now", "0-30d", "30-90d", "90d+", "Unknown"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      name: "",
      phone: "",
      email: "",
      intent: "",
      budgetMin: "",
      budgetMax: "",
      area: "",
      beds: "",
      timeline: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
        isLightMode
          ? 'bg-white/90 border border-white/50 text-gray-900 shadow-2xl'
          : 'bg-white/10 border border-white/20 text-gray-100 shadow-2xl backdrop-blur-xl'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
              Add New Lead
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={`text-2xl font-bold ${isLightMode ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-200'}`}
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full rounded-xl px-4 py-3 text-sm ${
                  isLightMode
                    ? 'bg-white/50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white/10 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
                }`}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 ${
                  isLightMode
                    ? 'bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                    : 'bg-white/15 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20'
                }`}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 ${
                  isLightMode
                    ? 'bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                    : 'bg-white/15 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20'
                }`}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Intent *
              </label>
              <select
                name="intent"
                value={formData.intent}
                onChange={handleChange}
                required
                className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 appearance-none bg-no-repeat ${
                  isLightMode
                    ? 'bg-white/70 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                    : 'bg-white/15 border border-white/20 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 [&>option]:text-gray-900'
                }`}
              >
                <option value="">Select intent</option>
                {intents.map(intent => (
                  <option key={intent} value={intent}>{intent}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                  Budget (Min)
                </label>
                <input
                  type="number"
                  name="budgetMin"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 ${
                    isLightMode
                      ? 'bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                      : 'bg-white/15 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20'
                  }`}
                  placeholder="Min amount"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                  Budget (Max)
                </label>
                <input
                  type="number"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 ${
                    isLightMode
                      ? 'bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                      : 'bg-white/15 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20'
                  }`}
                  placeholder="Max amount"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Area *
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 appearance-none bg-no-repeat ${
                  isLightMode
                    ? 'bg-white/70 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                    : 'bg-white/15 border border-white/20 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 [&>option]:text-gray-900'
                }`}
              >
                <option value="">Select area</option>
                <option value="Noida">Noida</option>
                <option value="Powai">Powai</option>
                <option value="Bandra">Bandra</option>
                <option value="New Delhi">New Delhi</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Beds
              </label>
              <select
                name="beds"
                value={formData.beds}
                onChange={handleChange}
                className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 appearance-none bg-no-repeat ${
                  isLightMode
                    ? 'bg-white/70 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                    : 'bg-white/15 border border-white/20 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 [&>option]:text-gray-900'
                }`}
              >
                <option value="">Select beds</option>
                {bedOptions.map(bed => (
                  <option key={bed} value={bed}>{bed}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Timeline
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className={`w-full rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 appearance-none bg-no-repeat ${
                  isLightMode
                    ? 'bg-white/70 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'
                    : 'bg-white/15 border border-white/20 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 [&>option]:text-gray-900'
                }`}
              >
                <option value="">Select timeline</option>
                {timelineOptions.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={`flex-1 rounded-2xl px-6 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isLightMode
                    ? 'border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    : 'border border-white/20 bg-white/15 backdrop-blur-sm text-gray-300 hover:bg-white/20 hover:border-white/30'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 rounded-2xl px-6 py-3.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLightMode
                    ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md disabled:opacity-50'
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg disabled:opacity-50'
                }`}
              >
                {loading ? (
                  <>
                    <IconRefresh className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Lead'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}