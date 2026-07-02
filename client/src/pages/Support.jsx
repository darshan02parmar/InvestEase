import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, ChevronRight, MessageSquare, ArrowLeft, CheckCircle, RefreshCcw, FileText, CreditCard, AlertTriangle, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Support = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Wizard State
  const [step, setStep] = useState(1); // 1: Select Issue, 2: Resolution, 3: Form, 4: Success Thank You
  const [selectedIssue, setSelectedIssue] = useState('');
  
  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/support');
      setRequests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResolutionContent = () => {
    switch (selectedIssue) {
      case 'SIP Failed':
        return {
          title: "Verify Mandate & Account Balance",
          message: "Most SIP failures occur due to insufficient balance or outdated bank mandates. Please ensure your linked account has sufficient funds. If you have recently changed banks, you must update your Auto SIP bank mandate.",
          actionText: "Check SIP Status",
          linkTo: "/sip"
        };
      case 'Statement Missing':
        return {
          title: "Download Statements Instantly",
          message: "Account statements are generated automatically at the end of each month. You can download yours directly from the Statements panel without raising a support request.",
          actionText: "Go to Statements",
          linkTo: "/statements"
        };
      case 'KYC':
        return {
          title: "Check KYC Document Requirements",
          message: "KYC verification takes up to 3 business days. If rejected, please review the admin remarks and submit clear front-and-back scans of your PAN and Aadhaar card.",
          actionText: "Verify KYC Status",
          linkTo: "/kyc"
        };
      case 'Nominee':
        return {
          title: "Manage Nominee Configuration",
          message: "Adding a nominee protects your assets and raises your Investor Health Score by 20%. You can add or update nominee details dynamically.",
          actionText: "Manage Nominees",
          linkTo: "/nominee"
        };
      default:
        return {
          title: "General Query",
          message: "For general queries, please review our help guides or proceed to raise a support ticket directly to speak to our operations team.",
          actionText: "Proceed to Support",
          linkTo: "#"
        };
    }
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post('/support', {
        subject: ticketSubject || `${selectedIssue} Issue`,
        message: ticketMessage
      });
      setSuccess(true);
      fetchRequests();
      setStep(4);
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setTicketMessage('');
        setTicketSubject('');
        setSelectedIssue('');
        setStep(1);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedIssue('');
    setTicketSubject('');
    setTicketMessage('');
    setStep(1);
  };

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 w-1/4 rounded"></div>
      <div className="h-64 bg-gray-200 rounded-3xl"></div>
    </div>
  );

  const resolution = getResolutionContent();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 bg-[#F5F7FB]">
      <div>
        <h1 className="text-2xl font-outfit font-bold text-navy-900">Guided Resolution Center</h1>
        <p className="text-navy-500 text-sm">Resolve issues instantly using our smart self-service assistant.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Guided Assistant Panel (Strict Wizard Flow) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="font-bold text-navy-900 flex items-center gap-2 font-outfit">
              <LifeBuoy className="w-5 h-5 text-teal-600 animate-spin" style={{ animationDuration: '3s' }} />
              Guided Resolution Wizard
            </h2>
            {step > 1 && step < 4 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-xs text-navy-500 hover:text-navy-900 flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
          </div>
          
          <div className="min-h-[300px] flex flex-col justify-center">
            
            {/* Step 1: Select Issue */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-base font-bold text-navy-900 font-outfit">What issue are you facing?</h3>
                <div className="space-y-3">
                  {['SIP Failed', 'Statement Missing', 'KYC', 'Nominee'].map(issue => (
                    <label 
                      key={issue}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                        selectedIssue === issue 
                          ? 'border-teal-500 bg-teal-50/30 ring-2 ring-teal-500/20' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="issueType" 
                        value={issue}
                        checked={selectedIssue === issue}
                        onChange={() => setSelectedIssue(issue)}
                        className="w-4.5 h-4.5 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="text-sm font-semibold text-navy-800">{issue}</span>
                    </label>
                  ))}
                </div>
                
                <button
                  disabled={!selectedIssue}
                  onClick={() => setStep(2)}
                  className="w-full btn-primary py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Suggested Resolution */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in text-center py-4">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-600">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-900 font-outfit">{resolution.title}</h3>
                  <p className="text-xs font-medium text-navy-500 mt-1 uppercase tracking-widest">Suggested Resolution</p>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed max-w-sm mx-auto bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                  {resolution.message}
                </p>
                
                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                  {selectedIssue !== 'General' && (
                    <Link to={resolution.linkTo} className="btn-primary py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
                      {resolution.actionText} <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                  
                  <div className="pt-4 border-t border-gray-100 mt-2">
                    <p className="text-xs font-bold text-navy-900 mb-3">Resolved?</p>
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={() => setStep(4)} 
                        className="px-6 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                      >
                        Yes, Resolved
                      </button>
                      <button 
                        onClick={() => {
                          setTicketSubject(`${selectedIssue} Resolution Failed`);
                          setStep(3);
                        }} 
                        className="px-6 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                      >
                        No, Raise Support Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Raise Support Request Form */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-navy-900 font-outfit">Raise Support Request</h3>
                  <p className="text-xs text-navy-500 mt-0.5">Please provide specific details to help our team assist you quickly.</p>
                </div>
                
                <form onSubmit={submitTicket} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Subject</label>
                    <input 
                      type="text" 
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="input-field py-2.5 rounded-xl" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Message</label>
                    <textarea 
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="input-field min-h-[100px] py-2.5 rounded-xl" 
                      required 
                      placeholder="Describe your issue in detail..."
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5 rounded-xl font-bold">
                    {submitting ? 'Submitting...' : 'Submit Support Request'}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: Success Thank You */}
            {step === 4 && (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-900 font-outfit">Thank You!</h3>
                  <p className="text-sm text-navy-600 max-w-xs mx-auto">
                    {success 
                      ? "Your support ticket has been submitted. Our operations team will respond shortly." 
                      : "We're glad we could help you resolve this issue immediately."
                    }
                  </p>
                </div>
                <button 
                  onClick={handleReset} 
                  className="text-xs font-bold text-teal-600 hover:underline pt-4"
                >
                  Start New Query
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Previous Tickets Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-0 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2 font-outfit">
              <MessageSquare className="w-5 h-5 text-navy-400" />
              Your Support Tickets
            </h3>
          </div>
          
          {requests.length === 0 ? (
            <div className="p-8 text-center text-navy-500 flex-1 flex flex-col justify-center min-h-[300px]">
              <p className="text-sm font-medium">You haven't raised any tickets yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-navy-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-navy-900">
                        {req.subject}
                        {req.adminResponse && (
                          <div className="mt-2 text-xs bg-teal-50 text-teal-800 p-3 rounded-xl border border-teal-100/50 font-medium">
                            <strong>Response:</strong> {req.adminResponse}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                          req.status === 'Open' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-navy-400 whitespace-nowrap font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Support;
