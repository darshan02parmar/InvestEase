import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, RefreshCcw, CreditCard, LifeBuoy, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';

const SIPs = () => {
  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(null);

  useEffect(() => {
    fetchSIPs();
  }, []);

  const fetchSIPs = async () => {
    try {
      const response = await api.get('/sips');
      setSips(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id) => {
    setRetrying(id);
    try {
      await api.post(`/sips/${id}/retry`);
      fetchSIPs(); // Refresh the list
    } catch (error) {
      console.error('Failed to retry SIP', error);
      alert('Failed to retry payment. Please contact support.');
    } finally {
      setRetrying(null);
    }
  };

  const handleUpdateMandate = () => {
    alert('Redirecting to your bank\'s secure mandate portal... (This is a mock action)');
  };

  if (loading) return <div>Loading your Systematic Investment Plans...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Systematic Investment Plans (SIPs)</h1>
        <p className="text-navy-500">Manage your recurring investments seamlessly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sips.map((sip) => (
          <div 
            key={sip._id} 
            className={`card flex flex-col justify-between ${
              sip.status === 'Failed' 
                ? 'border-red-300 shadow-[0_0_0_1px_rgba(239,68,68,0.3)] bg-red-50/10' 
                : ''
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sip.status === 'Failed' ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">{sip.fundName}</h3>
                    <p className="text-xs text-navy-500">{sip.frequency} Investment</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  sip.status === 'Active' ? 'bg-green-50 border-green-200 text-green-700' :
                  sip.status === 'Failed' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  {sip.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-navy-50 p-3 rounded-lg border border-navy-100">
                  <p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Amount</p>
                  <p className="font-semibold text-navy-900">₹{sip.amount.toLocaleString()}</p>
                </div>
                <div className="bg-navy-50 p-3 rounded-lg border border-navy-100">
                  <p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Next Debit</p>
                  <p className="font-semibold text-navy-900">{new Date(sip.nextDebit).toLocaleDateString()}</p>
                </div>
              </div>

              {sip.status === 'Failed' && (
                <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="text-red-800 font-semibold flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4" /> Action Required
                  </h4>
                  <p className="text-sm text-red-600 mb-4">
                    Reason: <span className="font-medium">{sip.failureReason || 'Payment rejected by bank.'}</span>
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleRetry(sip._id)}
                      disabled={retrying === sip._id}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCcw className={`w-4 h-4 ${retrying === sip._id ? 'animate-spin' : ''}`} />
                      {retrying === sip._id ? 'Retrying...' : 'Retry Payment'}
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={handleUpdateMandate}
                        className="flex-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 font-medium py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Mandate
                      </button>
                      <Link 
                        to="/support"
                        className="flex-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 font-medium py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs"
                      >
                        <LifeBuoy className="w-3.5 h-3.5" /> Support
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {sip.status !== 'Failed' && (
              <div className="pt-4 border-t border-navy-100 flex justify-end">
                <button className="text-sm text-teal-600 hover:text-teal-800 font-medium">View History</button>
              </div>
            )}
          </div>
        ))}

        {sips.length === 0 && (
          <div className="col-span-full card py-12 flex flex-col items-center justify-center text-navy-500 text-center">
            <Activity className="w-12 h-12 text-navy-200 mb-4" />
            <h3 className="text-lg font-semibold text-navy-900">No Active SIPs</h3>
            <p className="mt-1 max-w-md">You haven't set up any Systematic Investment Plans yet. SIPs are a great way to build wealth steadily over time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SIPs;
