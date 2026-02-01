'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  getGovernorates,
  createGovernorate,
  updateGovernorate,
  deleteGovernorate
} from '@/lib/client/api-admin';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Globe,
  MapPin,
  Loader2,
  Check,
  X,
  Package,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Country, Governorate } from '@/types';

type TabType = 'countries' | 'governorates';

export default function LocationsManagementPage() {
  const { token } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<TabType>('countries');
  const [countries, setCountries] = useState<Country[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<Country | Governorate | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  // Country Form
  const [countryFormData, setCountryFormData] = useState({
    nameAr: '',
    nameEn: '',
    code: '',
    phoneCode: '',
    sortOrder: 0
  });

  // Governorate Form
  const [governorateFormData, setGovernorateFormData] = useState({
    countryId: '',
    nameAr: '',
    nameEn: '',
    code: '',
    shippingCost: '0',
    estimatedDays: 0,
    sortOrder: 0
  });

  useEffect(() => {
    if (token) {
      loadLocations();
    }
  }, [token, activeTab]);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      if (activeTab === 'countries') {
        const data = await getCountries(token!);
        setCountries(data);
      } else {
        const data = await getGovernorates(token!);
        setGovernorates(data);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = activeTab === 'countries'
    ? countries.filter(country =>
        country.nameAr.includes(searchTerm) ||
        country.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : governorates.filter(gov =>
        gov.nameAr.includes(searchTerm) ||
        gov.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gov.code.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    if (activeTab === 'countries') {
      setCountryFormData({
        nameAr: '',
        nameEn: '',
        code: '',
        phoneCode: '',
        sortOrder: countries.length
      });
    } else {
      setGovernorateFormData({
        countryId: countries.length > 0 ? countries[0].id.toString() : '',
        nameAr: '',
        nameEn: '',
        code: '',
        shippingCost: '0',
        estimatedDays: 0,
        sortOrder: governorates.length
      });
    }
    setShowModal(true);
  };

  const handleEdit = (item: Country | Governorate) => {
    setModalMode('edit');
    setSelectedItem(item);
    if (activeTab === 'countries') {
      const country = item as Country;
      setCountryFormData({
        nameAr: country.nameAr,
        nameEn: country.nameEn,
        code: country.code,
        phoneCode: country.phoneCode,
        sortOrder: country.sortOrder
      });
    } else {
      const gov = item as Governorate;
      setGovernorateFormData({
        countryId: gov.countryId.toString(),
        nameAr: gov.nameAr,
        nameEn: gov.nameEn,
        code: gov.code,
        shippingCost: gov.shippingCost,
        estimatedDays: gov.estimatedDays,
        sortOrder: gov.sortOrder
      });
    }
    setShowModal(true);
    setActionMenuOpen(null);
  };

  const handleDelete = (item: Country | Governorate) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
    setActionMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (activeTab === 'countries') {
        if (modalMode === 'create') {
          await createCountry(token!, countryFormData);
          toast.success('Country created successfully');
        } else if (modalMode === 'edit' && selectedItem) {
          await updateCountry(token!, (selectedItem as Country).id, countryFormData);
          toast.success('Country updated successfully');
        }
      } else {
        const govData = {
          ...governorateFormData,
          countryId: parseInt(governorateFormData.countryId),
          shippingCost: governorateFormData.shippingCost
        };
        if (modalMode === 'create') {
          await createGovernorate(token!, govData);
          toast.success('Governorate created successfully');
        } else if (modalMode === 'edit' && selectedItem) {
          await updateGovernorate(token!, (selectedItem as Governorate).id, govData);
          toast.success('Governorate updated successfully');
        }
      }

      setShowModal(false);
      loadLocations();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      setIsLoading(true);
      if (activeTab === 'countries') {
        await deleteCountry(token!, (selectedItem as Country).id);
      } else {
        await deleteGovernorate(token!, (selectedItem as Governorate).id);
      }
      toast.success(`${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)} deleted successfully`);
      setShowDeleteModal(false);
      loadLocations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Locations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage countries and governorates
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add {activeTab === 'countries' ? 'Country' : 'Governorate'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('countries')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'countries'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Globe size={20} />
          Countries ({countries.length})
        </button>
        <button
          onClick={() => setActiveTab('governorates')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'governorates'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <MapPin size={20} />
          Governorates ({governorates.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {activeTab === 'countries' ? (
                      <Globe className="text-white" size={24} />
                    ) : (
                      <MapPin className="text-white" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(item as Country).nameAr || (item as Governorate).nameAr}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(item as Country).nameEn || (item as Governorate).nameEn}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {actionMenuOpen === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {activeTab === 'countries' ? (
                  <>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Globe size={14} className="mr-2" />
                      Code: {(item as Country).code}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      Phone: {(item as Country).phoneCode}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={14} className="mr-2" />
                      Code: {(item as Governorate).code}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Truck size={14} className="mr-2" />
                      Shipping: ${(item as Governorate).shippingCost}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Package size={14} className="mr-2" />
                      {+(item as Governorate).estimatedDays} days delivery
                    </div>
                    {(item as Governorate).isActive !== undefined && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        (item as Governorate).isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {(item as Governorate).isActive ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                        {(item as Governorate).isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sort: {item.sortOrder}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No {activeTab} found
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'create' ? `Add New ${activeTab === 'countries' ? 'Country' : 'Governorate'}` : `Edit ${activeTab === 'countries' ? 'Country' : 'Governorate'}`}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {activeTab === 'countries' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name (Arabic) *
                    </label>
                    <input
                      type="text"
                      value={countryFormData.nameAr}
                      onChange={(e) => setCountryFormData({ ...countryFormData, nameAr: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name (English) *
                    </label>
                    <input
                      type="text"
                      value={countryFormData.nameEn}
                      onChange={(e) => setCountryFormData({ ...countryFormData, nameEn: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Code *
                      </label>
                      <input
                        type="text"
                        value={countryFormData.code}
                        onChange={(e) => setCountryFormData({ ...countryFormData, code: e.target.value.toUpperCase() })}
                        required
                        maxLength={3}
                        placeholder="EG"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Code *
                      </label>
                      <input
                        type="text"
                        value={countryFormData.phoneCode}
                        onChange={(e) => setCountryFormData({ ...countryFormData, phoneCode: e.target.value })}
                        required
                        placeholder="+20"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={countryFormData.sortOrder}
                      onChange={(e) => setCountryFormData({ ...countryFormData, sortOrder: parseInt(e.target.value) })}
                      min={0}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country *
                    </label>
                    <select
                      value={governorateFormData.countryId}
                      onChange={(e) => setGovernorateFormData({ ...governorateFormData, countryId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name (Arabic) *
                    </label>
                    <input
                      type="text"
                      value={governorateFormData.nameAr}
                      onChange={(e) => setGovernorateFormData({ ...governorateFormData, nameAr: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name (English) *
                    </label>
                    <input
                      type="text"
                      value={governorateFormData.nameEn}
                      onChange={(e) => setGovernorateFormData({ ...governorateFormData, nameEn: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Code *
                      </label>
                      <input
                        type="text"
                        value={governorateFormData.code}
                        onChange={(e) => setGovernorateFormData({ ...governorateFormData, code: e.target.value.toUpperCase() })}
                        required
                        maxLength={5}
                        placeholder="CA"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estimated Days
                      </label>
                      <input
                        type="number"
                        value={governorateFormData.estimatedDays}
                        onChange={(e) => setGovernorateFormData({ ...governorateFormData, estimatedDays: parseInt(e.target.value) })}
                        min={0}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Shipping Cost *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={governorateFormData.shippingCost}
                          onChange={(e) => setGovernorateFormData({ ...governorateFormData, shippingCost: e.target.value })}
                          required
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={governorateFormData.sortOrder}
                        onChange={(e) => setGovernorateFormData({ ...governorateFormData, sortOrder: parseInt(e.target.value) })}
                        min={0}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : modalMode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete {activeTab === 'countries' ? 'Country' : 'Governorate'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>
                  {activeTab === 'countries'
                    ? (selectedItem as Country)?.nameAr
                    : (selectedItem as Governorate)?.nameAr}
                </strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
