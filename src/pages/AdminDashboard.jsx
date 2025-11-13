import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiMail, FiRefreshCw, FiAward } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { formatDate } from '../utils/helpers';
import { fetchAllUsers, fetchContactMessages, updateUserRole } from '../services/adminService';

const AdminDashboard = () => {
  const { hasAdminAccess, isOwner } = useAuth();
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [userDocs, contactDocs] = await Promise.all([
        fetchAllUsers(),
        fetchContactMessages()
      ]);
      setUsers(userDocs);
      setContacts(contactDocs);
    } catch (error) {
      toast.error('Failed to load admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAdminAccess) {
      loadData();
    }
  }, [hasAdminAccess]);

  const handleRoleChange = async (uid, role) => {
    if (role === 'owner' && !isOwner) {
      toast.error('Only owners can assign owner role');
      return;
    }

    setActionLoading(`${uid}-${role}`);
    try {
      await updateUserRole(uid, role);
      setUsers((prev) => prev.map((user) => (user.uid === uid || user.id === uid ? { ...user, role } : user)));
      toast.success(`Role updated to ${role}`);
    } catch (error) {
      toast.error('Failed to update role');
      console.error(error);
    } finally {
      setActionLoading('');
    }
  };

  if (!hasAdminAccess) {
    return <Loading text="Checking access..." fullscreen />;
  }

  if (loading) {
    return <Loading text="Loading admin data..." fullscreen />;
  }

  const totalUsers = users.length;
  const ownerCount = users.filter((user) => user.role === 'owner').length;
  const adminCount = users.filter((user) => user.role === 'admin').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-12 space-y-6 sm:space-y-8">
        <motion.div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 font-semibold mb-2">
                Admin Control
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Owner Console</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage user roles, review contact messages, and keep the workspace safe.
              </p>
            </div>
            <Button onClick={loadData} variant="outline" className="inline-flex items-center gap-2 w-full sm:w-auto justify-center">
              <FiRefreshCw />
              Refresh
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                <FiUsers className="text-primary-600 dark:text-primary-400 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total users</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalUsers}</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <FiShield className="text-emerald-600 dark:text-emerald-400 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{adminCount}</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <FiAward className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Owners</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{ownerCount}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Manage roles and privileges</p>
            </div>
          </div>

          <div className="overflow-x-auto hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs">Created</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.uid || user.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 dark:text-white">{user.displayName || user.email}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-800 dark:text-gray-200">{user.role || 'user'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {user.createdAt?.toDate ? formatDate(user.createdAt.toDate(), 'MMM dd, yyyy') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRoleChange(user.uid || user.id, 'user')}
                          disabled={actionLoading === `${user.uid || user.id}-user` || user.role === 'user'}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
                        >
                          Set user
                        </button>
                        <button
                          onClick={() => handleRoleChange(user.uid || user.id, 'admin')}
                          disabled={actionLoading === `${user.uid || user.id}-admin` || user.role === 'admin'}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-40"
                        >
                          Make admin
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => handleRoleChange(user.uid || user.id, 'owner')}
                            disabled={actionLoading === `${user.uid || user.id}-owner` || user.role === 'owner'}
                            className="px-3 py-1.5 text-xs font-semibold rounded-full border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-40"
                          >
                            Promote owner
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {users.map((user) => (
              <div key={user.uid || user.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.displayName || user.email}</p>
                  <p className="text-sm text-gray-500 break-all">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 capitalize">
                    {user.role || 'user'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    {user.createdAt?.toDate ? formatDate(user.createdAt.toDate(), 'MMM dd, yyyy') : '—'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRoleChange(user.uid || user.id, 'user')}
                    disabled={actionLoading === `${user.uid || user.id}-user` || user.role === 'user'}
                    className="flex-1 min-w-[120px] px-3 py-2 text-xs font-semibold rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
                  >
                    Set user
                  </button>
                  <button
                    onClick={() => handleRoleChange(user.uid || user.id, 'admin')}
                    disabled={actionLoading === `${user.uid || user.id}-admin` || user.role === 'admin'}
                    className="flex-1 min-w-[120px] px-3 py-2 text-xs font-semibold rounded-full border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-40"
                  >
                    Make admin
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => handleRoleChange(user.uid || user.id, 'owner')}
                      disabled={actionLoading === `${user.uid || user.id}-owner` || user.role === 'owner'}
                      className="flex-1 min-w-[120px] px-3 py-2 text-xs font-semibold rounded-full border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-40"
                    >
                      Promote owner
                    </button>
                  )}
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-center text-gray-500">No users found.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact messages</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Latest submissions from the public site</p>
            </div>
          </div>

          <div className="space-y-4">
            {contacts.length === 0 && (
              <p className="text-sm text-gray-500">No contact messages yet.</p>
            )}

            {contacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <FiMail className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                      <p className="text-gray-500 text-sm">{contact.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {contact.createdAt?.toDate ? formatDate(contact.createdAt.toDate(), 'MMM dd, yyyy HH:mm') : '—'}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{contact.subject}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contact.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
