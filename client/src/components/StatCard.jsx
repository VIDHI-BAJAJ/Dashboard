export function StatCard({ title, value }) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-2">
          {value}
        </h2>
      </div>
    );
  }