"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/actions/addressActions";
import Link from "next/link";

interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressesClientProps {
  initialAddresses: Address[];
}

export default function AddressesClient({
  initialAddresses,
}: AddressesClientProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    alias: "",
    details: "",
    phone: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await addAddress(formData);
      if (result.success && result.data) {
        setAddresses([...addresses, result.data]);
        setFormData({
          alias: "",
          details: "",
          phone: "",
          city: "",
          postalCode: "",
        });
        setIsAdding(false);
        setSuccess("Address added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to add address");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateAddress(editingId, formData);
      if (result.success && result.data) {
        setAddresses(
          addresses.map((addr) => (addr._id === editingId ? result.data! : addr))
        );
        setFormData({
          alias: "",
          details: "",
          phone: "",
          city: "",
          postalCode: "",
        });
        setEditingId(null);
        setSuccess("Address updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to update address");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await deleteAddress(addressId);
      if (result.success) {
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
        setSuccess("Address deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to delete address");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await setDefaultAddress(addressId);
      if (result.success) {
        setAddresses(
          addresses.map((addr) => ({
            ...addr,
            isDefault: addr._id === addressId,
          }))
        );
        setSuccess("Default address updated!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to set default address");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingId(address._id);
    setFormData({
      alias: address.alias,
      details: address.details,
      phone: address.phone,
      city: address.city,
      postalCode: address.postalCode,
    });
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      alias: "",
      details: "",
      phone: "",
      city: "",
      postalCode: "",
    });
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      alias: "",
      details: "",
      phone: "",
      city: "",
      postalCode: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
          </div>
          {!isAdding && !editingId && (
            <Button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Address
            </Button>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Form */}
        {(isAdding || editingId) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <form
              onSubmit={editingId ? handleUpdateAddress : handleAddAddress}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Label (e.g., Home, Office)
                  </label>
                  <input
                    type="text"
                    name="alias"
                    value={formData.alias}
                    onChange={handleInputChange}
                    placeholder="Home"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01234567890"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Enter your street address"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Cairo"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading
                    ? "Saving..."
                    : editingId
                      ? "Update Address"
                      : "Add Address"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600 mb-4">No addresses saved yet</p>
              {!isAdding && (
                <Button
                  onClick={handleAddNew}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Your First Address
                </Button>
              )}
            </div>
          ) : (
            addresses.map((address, idx) => (
              <div
                key={address._id ?? `addr-${idx}`}
                className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {address.alias}
                    </h3>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{address.details}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.postalCode}
                  </p>
                  <p className="text-gray-600">{address.phone}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onClick={() => handleEditAddress(address)}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteAddress(address._id)}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                  {!address.isDefault && (
                    <Button
                      onClick={() => handleSetDefault(address._id)}
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                    >
                      Set Default
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          <Link href="/checkout">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
