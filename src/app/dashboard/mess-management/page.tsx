import Link from 'next/link';

const MessManagementDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard">
          <span className="text-cyan-400 hover:text-cyan-300 transition-colors">&larr; Back to Main Dashboard</span>
        </Link>
        <h1 className="text-5xl font-bold my-8 text-center" style={{ color: '#00c6ff' }}>
          Mess Management Dashboard
        </h1>
        <p className="text-center text-lg text-gray-300">
          This is where you will manage daily mess operations, menus, and billing.
        </p>
        {/* Add your Mess Management components here */}
      </div>
    </div>
  );
};

export default MessManagementDashboard;
