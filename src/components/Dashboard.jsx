export default function TicketingDashboard() {
  const tickets = [
    {
      id: "TCK-1001",
      title: "Invoice PDF Missing",
      status: "Open",
      priority: "High",
      fileType: "PDF",
      assignedTo: "Rahul",
      createdDate: "2026-05-20",
    },
    {
      id: "TCK-1002",
      title: "Excel Upload Failed",
      status: "In Progress",
      priority: "Medium",
      fileType: "XLSX",
      assignedTo: "Neha",
      createdDate: "2026-05-18",
    },
    {
      id: "TCK-1003",
      title: "Corrupted Image Preview",
      status: "Closed",
      priority: "Low",
      fileType: "PNG",
      assignedTo: "Amit",
      createdDate: "2026-05-15",
    },
  ];

  const auditLogs = [
    {
      id: 1,
      action: "DOWNLOAD_FILE",
      user: "Saurabh",
      timestamp: "2026-05-20 10:15 AM",
    },
    {
      id: 2,
      action: "CREATE_TICKET",
      user: "Rahul",
      timestamp: "2026-05-20 11:20 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-72 bg-white shadow-lg border-r border-gray-200 p-5">
        <div className="text-2xl font-bold text-blue-600 mb-10">
          Ticketing System
        </div>

        <nav className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow">
            Dashboard
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition">
            Tickets
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition">
            Audit Logs
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition">
            User Management
          </button>
        </nav>

        <div className="mt-12 p-4 rounded-2xl bg-blue-50 border border-blue-100">
          <div className="text-sm text-gray-500">Logged in as</div>
          <div className="font-semibold text-gray-800">Admin</div>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage tickets, files and audit logs
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50">
              Export
            </button>

            <button className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
              Create Ticket
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Total Tickets</div>
            <div className="text-4xl font-bold mt-3">120</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Open Tickets</div>
            <div className="text-4xl font-bold mt-3 text-orange-500">32</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Downloads</div>
            <div className="text-4xl font-bold mt-3 text-green-600">450</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Uploads</div>
            <div className="text-4xl font-bold mt-3 text-blue-600">220</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Dynamic Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <input
              placeholder="Search ticket"
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
              <option>Status</option>
              <option>Open</option>
              <option>Closed</option>
              <option>In Progress</option>
            </select>

            <select className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
              <option>File Type</option>
              <option>PDF</option>
              <option>XLSX</option>
              <option>PNG</option>
            </select>

            <input
              type="date"
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button className="bg-blue-600 text-white rounded-xl px-4 py-3 hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Ticket Listing
            </h2>
          </div>

          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 text-sm">
                <th className="py-4">Ticket ID</th>
                <th className="py-4">Title</th>
                <th className="py-4">Status</th>
                <th className="py-4">Priority</th>
                <th className="py-4">File Type</th>
                <th className="py-4">Assigned To</th>
                <th className="py-4">Created Date</th>
                <th className="py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-5 font-medium text-blue-600">
                    {ticket.id}
                  </td>

                  <td className="py-5">{ticket.title}</td>

                  <td className="py-5">
                    <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700">
                      {ticket.status}
                    </span>
                  </td>

                  <td className="py-5">{ticket.priority}</td>

                  <td className="py-5">{ticket.fileType}</td>

                  <td className="py-5">{ticket.assignedTo}</td>

                  <td className="py-5">{ticket.createdDate}</td>

                  <td className="py-5">
                    <div className="flex gap-2">
                      <button className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200">
                        Preview
                      </button>

                      <button className="px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-800">
                File Preview
              </h2>
            </div>

            <div className="border border-dashed border-gray-300 rounded-2xl h-96 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-700">
                  PDF/Image Preview Area
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Preview selected files here
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-800">
                Audit Logs
              </h2>
            </div>

            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {log.action}
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        Performed by {log.user}
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
