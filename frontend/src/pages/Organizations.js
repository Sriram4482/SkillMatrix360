import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Validation functions
const validateOrganizationName = (name) => {
  return name.trim().length >= 2;
};

const validateOrganizationForm = (formData) => {
  const errors = {};

  if (!validateOrganizationName(formData.name)) {
    errors.name = 'Organization name must be at least 2 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default function Organizations() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingOrg, setEditingOrg] = useState(null);
  const [addingOrg, setAddingOrg] = useState(false);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [orgsPerPage, setOrgsPerPage] = useState(6);
  
  // Validation states
  const [formErrors, setFormErrors] = useState({});

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orgs");
      setOrgs(res.data);
    } catch {
      toast.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  // Filter organizations based on search
  const filteredOrgs = orgs.filter(org => {
    return org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           org.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination calculations
  const indexOfLastOrg = currentPage * orgsPerPage;
  const indexOfFirstOrg = indexOfLastOrg - orgsPerPage;
  const currentOrgs = filteredOrgs.slice(indexOfFirstOrg, indexOfLastOrg);
  const totalPages = Math.ceil(filteredOrgs.length / orgsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination functions
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const addOrg = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateOrganizationForm(form);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    setAddingOrg(true);
    setFormErrors({});
    
    try {
      const res = await API.post("/orgs", form);
      setOrgs(prev => [...prev, res.data]);
      toast.success("Organization added successfully");
      setForm({ name: "", description: "" });
      setShowAdd(false);
    } catch {
      toast.error("Failed to add organization");
    } finally {
      setAddingOrg(false);
    }
  };

  const updateOrg = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateOrganizationForm(form);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    try {
      const res = await API.put(`/orgs/${editingOrg.id}`, form);
      setOrgs(prev => prev.map(o => (o.id === editingOrg.id ? res.data : o)));
      toast.success("Organization updated successfully");
      setEditingOrg(null);
      setForm({ name: "", description: "" });
      setShowAdd(false);
      setFormErrors({});
    } catch {
      toast.error("Failed to update organization");
    }
  };

  const deleteOrg = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;
    try {
      await API.delete(`/orgs/${id}`);
      setOrgs(prev => prev.filter(o => o.id !== id));
      toast.success("Organization deleted successfully");
    } catch {
      toast.error("Failed to delete organization");
    }
  };

  const editOrg = (org) => {
    setEditingOrg(org);
    setForm({ name: org.name, description: org.description });
    setFormErrors({});
    setShowAdd(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Organizations" />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Organizations</h2>
                <p className="text-gray-500 dark:text-gray-300">Manage your organizations and teams</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setForm({ name: "", description: "" });
                  setEditingOrg(null);
                  setFormErrors({});
                  setShowAdd(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-colors w-fit"
              >
                <span>➕</span>
                Add Organization
              </motion.button>
            </div>

            {/* Search Section */}
            <div className="max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 dark:text-gray-500">🔍</span>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Results Count */}
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Showing {filteredOrgs.length} of {orgs.length} organizations
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Organizations Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : currentOrgs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {orgs.length === 0 ? "No organizations found" : "No organizations match your search"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Get started by creating your first organization</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentOrgs.map((org, index) => (
                  <motion.div
                    key={org.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                        🏢
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editOrg(org)}
                          className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-colors"
                        >
                          <span>✏️</span>
                        </button>
                        <button
                          onClick={() => deleteOrg(org.id)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{org.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{org.description || "No description provided"}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Created recently</span>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">Active</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Section */}
              {filteredOrgs.length > orgsPerPage && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                    <select
                      className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={orgsPerPage}
                      onChange={(e) => {
                        setOrgsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                    <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
                  </div>

                  {/* Page info */}
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {indexOfFirstOrg + 1}-{Math.min(indexOfLastOrg, filteredOrgs.length)} of {filteredOrgs.length} organizations
                  </div>

                  {/* Pagination buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                                : 'border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Add/Edit Organization Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {editingOrg ? "Edit Organization" : "Add Organization"}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                {editingOrg ? "Update organization details" : "Create a new organization"}
              </p>
            </div>
            
            <form onSubmit={editingOrg ? updateOrg : addOrg} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Name</label>
                <input
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    formErrors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="Enter organization name"
                  value={form.name}
                  onChange={e => {
                    setForm({ ...form, name: e.target.value });
                    if (formErrors.name) {
                      setFormErrors({ ...formErrors, name: '' });
                    }
                  }}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter organization description"
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdd(false);
                    setFormErrors({});
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  disabled={addingOrg}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    editingOrg 
                      ? "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600" 
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  }`}
                  disabled={addingOrg}
                >
                  {addingOrg ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {editingOrg ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    editingOrg ? "Update" : "Create"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}