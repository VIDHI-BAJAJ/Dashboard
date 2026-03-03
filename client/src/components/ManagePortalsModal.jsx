export default function ManagePortalsModal({ onClose }) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-[700px]">
          <h2 className="text-xl font-bold mb-6">Manage Portals</h2>
  
          <div className="grid grid-cols-3 gap-6">
  
            <div className="bg-green-500 text-white p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">realestate.com.au</h3>
              <p className="mt-4">Inactive</p>
              <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded">
                Activate Portal
              </button>
            </div>
  
            <div className="bg-blue-500 text-white p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Domain</h3>
              <p className="mt-4">Inactive</p>
              <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded">
                Activate Portal
              </button>
            </div>
  
          </div>
  
          <button onClick={onClose} className="mt-6 text-gray-500">
            Close
          </button>
        </div>
      </div>
    );
  }
  