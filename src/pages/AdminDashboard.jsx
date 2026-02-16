import React from "react";
import { Users, BookOpen, AlertCircle, BarChart3, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios.js";

const AdminDashboard = () => {
  // Fetch dynamic stats from your backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await api.get("/admin/stats");
      return res.data.stats;
    },
    refetchInterval: 60000, // Refresh stats every minute
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-error font-bold">
        Failed to load system statistics. Please check your connection.
      </div>
    );
  }

  const statsCards = [
    { label: "Total Users", val: data.totalUsers, icon: <Users size={20}/>, color: "text-blue-500" },
    { label: "Total Books", val: data.totalBooks, icon: <BookOpen size={20}/>, color: "text-green-500" },
    { label: "Flagged Items", val: data.reportedBooks, icon: <AlertCircle size={20}/>, color: "text-red-500" },
    { label: "Active Listings", val: data.activeListings, icon: <BarChart3 size={20}/>, color: "text-purple-500" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-error">Terminal Dashboard</h1>
          <div className="h-1.5 w-24 bg-error mt-2"></div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-black opacity-40 uppercase">System Status</p>
          <p className="text-sm font-bold text-success flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Live Data Feed
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statsCards.map((s, i) => (
          <div key={i} className="bg-base-200 p-6 rounded-3xl border border-base-300 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${s.color} mb-3`}>{s.icon}</div>
            <p className="text-3xl font-bold tracking-tight">{s.val?.toLocaleString()}</p>
            <p className="text-xs uppercase font-black opacity-40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* REPORTED CONTENT SECTION */}
      <div className="bg-base-200 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-300/20">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <AlertCircle className="text-error" size={20} />
            Flagged Content
          </h2>
          <span className="badge badge-error text-white font-bold p-3">
            {data.reportedBooks} Pending Actions
          </span>
        </div>
        
        {/* Placeholder Table - You can make this dynamic by adding a /api/admin/reports route */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/30">
                <th className="uppercase text-[10px] tracking-widest">Listing</th>
                <th className="uppercase text-[10px] tracking-widest">Owner Type</th>
                <th className="uppercase text-[10px] tracking-widest">Reason</th>
                <th className="text-right uppercase text-[10px] tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.reportedBooks === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 opacity-50 italic">No flagged content found.</td>
                </tr>
              ) : (
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="mask mask-squircle w-10 h-10 bg-base-300"></div>
                      <div>
                        <div className="font-bold">Sample Reported Book</div>
                        <div className="text-xs opacity-50 uppercase font-black">Reported by: System</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-outline badge-sm uppercase font-bold">User</span></td>
                  <td><span className="text-error font-bold text-xs uppercase">Policy Violation</span></td>
                  <td className="text-right">
                    <button className="btn btn-ghost btn-sm text-primary"><ExternalLink size={16}/></button>
                    <button className="btn btn-ghost btn-sm text-error"><Trash2 size={16}/></button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;