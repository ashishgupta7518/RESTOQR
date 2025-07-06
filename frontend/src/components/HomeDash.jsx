import React from 'react'
import { Home, Utensils, QrCode, BarChart, Settings, Edit, Trash2 } from "lucide-react";

const HomeDash = () => {
  return (
    <><section className="py-20 px-4 text-center">
      <h2 className="text-3xl font-bold mb-2">Powerful Dashboard</h2>
      <p className="text-lg mb-10 max-w-2xl mx-auto">
        Manage your restaurant menu with our easy-to-use dashboard interface.
      </p>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-stretch">
          {/* Sidebar */}
          <aside className="bg-gray-900 text-white w-64 p-4 space-y-4">
            <div className="font-semibold text-lg mb-4">🍴 Restaurant Dashboard</div>
            <nav className="space-y-2">
              <div className="flex items-center space-x-2 p-2 rounded bg-gray-800">
                <Home size={18} /> <span>Dashboard</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 cursor-pointer">
                <Utensils size={18} /> <span>Menu Management</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 cursor-pointer">
                <QrCode size={18} /> <span>QR Codes</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 cursor-pointer">
                <BarChart size={18} /> <span>Analytics</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 cursor-pointer">
                <Settings size={18} /> <span>Settings</span>
              </div>
            </nav>
          </aside>

          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Menu Categories</h3>
              <div className="text-gray-500">🔔 👤</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
              {[
                { title: "Main Courses", icon: "🍝", count: 12 },
                { title: "Beverages", icon: "☕", count: 8 },
                { title: "Desserts", icon: "🍰", count: 6 },
                { title: "Add New", icon: "➕", count: "Category" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded p-4 text-center hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    {typeof item.count === "number" ? `${item.count} items` : item.count}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8 mb-2">
              <h3 className="text-lg font-semibold">Recent Menu Items</h3>
              <button className="text-sm text-blue-600 hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded">
                <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  <tr>
                    <th className="py-2 px-4">Item Name</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: "Margherita Pizza", category: "Main Courses", price: "$12.99" },
                    { name: "Iced Coffee", category: "Beverages", price: "$4.50" },
                    { name: "Tiramisu", category: "Desserts", price: "$6.99" },
                  ].map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 px-4 font-medium">{item.name}</td>
                      <td className="py-2 px-4">{item.category}</td>
                      <td className="py-2 px-4">{item.price}</td>
                      <td className="py-2 px-4 flex space-x-2">
                        <button><Edit className="w-4 h-4 text-gray-600 hover:text-blue-600" /></button>
                        <button><Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </section></>
  )
}

export default HomeDash