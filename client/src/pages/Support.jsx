import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, ChevronRight, MessageSquare, ArrowLeft, CheckCircle, RefreshCcw, FileText, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Decision Tree JSON
const resolutionTree = {
  root: {
    question: "What do you need help with?",
    options: [
      { label: "My SIP Failed", next: "sip_bank_change" },
      { label: "KYC Update", next: "kyc_issue" },
      { label: "Nominee Addition", next: "nominee_issue" },
      { label: "Account Statement", next: "statement_issue" },
      { label: "Other / Speak to Agent", next: "ticket" }
    ]
  },
  sip_bank_change: {
    question: "Has your bank account changed recently?",
    options: [
      { label: "Yes", next: "action_update_mandate" },
      { label: "No", next: "sip_balance" }
    ]
  },
  sip_balance: {
    question: "Is there sufficient balance in your linked account?",
    options: [
      { label: "Yes", next: "action_retry_payment" },
      { label: "No", next: "action_maintain_balance" }
    ]
  },
  action_update_mandate: {
    type: "action",
    title: "Update Your Bank Mandate",
    message: "Since your bank account changed, your old mandate failed. Please register a new mandate.",
    buttonText: "Go to SIPs",
    linkTo: "/sip",
    icon: CreditCard
  },
  action_retry_payment: {
    type: "action",
    title: "Retry Payment",
    message: "If you have sufficient balance, it might be a temporary bank issue. You can retry the payment.",
    buttonText: "Go to SIPs to Retry",
    linkTo: "/sip",
    icon: RefreshCcw,
    ticketFallback: true // Allows them to raise a ticket if retry also fails
  },
  action_maintain_balance: {
    type: "action",
    title: "Maintain Balance",
    message: "Please deposit funds into your linked bank account. The system will automatically retry in 2 days, or you can retry manually.",
    buttonText: "Go to SIPs",
    linkTo: "/sip",
    icon: HelpCircle,
    ticketFallback: true
  },
  kyc_issue: {
    question: "What is the status of your KYC?",
    options: [
      { label: "Not Submitted", next: "action_submit_kyc" },
      { label: "Rejected", next: "action_submit_kyc" },
      { label: "Pending for over 3 days", next: "ticket" }
    ]
  },
  action_submit_kyc: {
    type: "action",
    title: "Submit KYC Documents",
    message: "Please navigate to the KYC section to upload your PAN, Aadhaar, and Address Proof.",
    buttonText: "Go to KYC",
    linkTo: "/kyc",
    icon: FileText
  },
  nominee_issue: {
    type: "action",
    title: "Manage Nominees",
    message: "You can easily add, edit, or remove nominees directly from your dashboard.",
    buttonText: "Go to Nominees",
    linkTo: "/nominee",
    icon: HelpCircle
  },
  statement_issue: {
    type: "action",
    title: "Download Statements",
    message: "You can generate and download monthly statements instantly without waiting for support.",
    buttonText: "Go to Statements",
    linkTo: "/statements",
    icon: FileText
  }
};

const Support = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Wizard State
  const [currentNodeId, setCurrentNodeId] = useState('root');
  const [history, setHistory] = useState([]);
  
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

  const handleOptionClick = (nextNodeId) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const handleBack = () => {
    const newHistory = [...history];
    const previousNodeId = newHistory.pop();
    setHistory(newHistory);
    setCurrentNodeId(previousNodeId);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post('/support', {
        subject: ticketSubject || 'Support Request via Assistant',
        message: ticketMessage
      });
      setSuccess(true);
      fetchRequests();
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setTicketMessage('');
        setTicketSubject('');
        setCurrentNodeId('root');
        setHistory([]);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const renderWizardNode = () => {
    if (currentNodeId === 'ticket') {
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            Raise a Support Ticket
          </h3>
          <p className="text-sm text-navy-600">Our team will get back to you within 24 hours.</p>
          
          {success ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center flex flex-col items-center">
              <CheckCircle className="w-12 h-12 mb-3" />
              <p className="font-bold">Ticket Submitted Successfully!</p>
              <p className="text-sm mt-1">Check the table below for updates.</p>
            </div>
          ) : (
            <form onSubmit={submitTicket} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="input-field" 
                  required 
                  placeholder="e.g. Need help with manual KYC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Message</label>
                <textarea 
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="input-field min-h-[100px]" 
                  required 
                  placeholder="Describe your issue in detail..."
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </div>
      );
    }

    const node = resolutionTree[currentNodeId];

    if (node.type === 'action') {
      const ActionIcon = node.icon || HelpCircle;
      return (
        <div className="animate-fadeIn text-center py-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ActionIcon className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">{node.title}</h3>
          <p className="text-navy-600 mb-6 max-w-sm mx-auto">{node.message}</p>
          
          <div className="flex flex-col gap-3">
            <Link to={node.linkTo} className="btn-primary inline-block">
              {node.buttonText}
            </Link>
            
            {node.ticketFallback && (
              <button onClick={() => setCurrentNodeId('ticket')} className="text-sm text-navy-500 hover:text-navy-700 underline mt-4">
                Did this not solve your problem? Raise a ticket.
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fadeIn">
        <h3 className="text-lg font-semibold text-navy-900 mb-6 text-center">{node.question}</h3>
        <div className="space-y-3">
          {node.options.map((option, idx) => (
            <button 
              key={idx}
              onClick={() => handleOptionClick(option.next)}
              className="w-full text-left px-4 py-4 rounded-xl border border-navy-200 hover:border-teal-500 hover:bg-teal-50 transition-colors flex justify-between items-center group bg-white shadow-sm"
            >
              <span className="font-medium text-navy-800 group-hover:text-teal-700">{option.label}</span>
              <ChevronRight className="w-5 h-5 text-navy-300 group-hover:text-teal-600" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Guided Resolution Center</h1>
        <p className="text-navy-500">Find immediate solutions or raise a ticket with our support team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Guided Assistant Panel */}
        <div className="card shadow-md border-teal-100 bg-gradient-to-b from-white to-navy-50/30">
          <div className="flex items-center justify-between mb-6 border-b border-navy-100 pb-4">
            <h2 className="font-bold text-navy-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              Smart Assistant
            </h2>
            {currentNodeId !== 'root' && (
              <button onClick={handleBack} className="text-sm text-navy-500 hover:text-navy-900 flex items-center gap-1 font-medium">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
          
          <div className="min-h-[300px] flex flex-col justify-center">
            {renderWizardNode()}
          </div>
        </div>

        {/* Previous Tickets Panel */}
        <div className="card p-0 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-navy-100 bg-navy-50/50">
            <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-navy-400" />
              Your Support Tickets
            </h3>
          </div>
          
          {requests.length === 0 ? (
            <div className="p-8 text-center text-navy-500 flex-1 flex flex-col justify-center">
              <p>You haven't raised any tickets yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-navy-50 text-navy-600 text-sm">
                  <tr>
                    <th className="px-6 py-3 font-medium">Subject</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100 text-sm">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-navy-900">
                        {req.subject}
                        {req.adminResponse && (
                          <div className="mt-2 text-xs bg-teal-50 text-teal-800 p-2 rounded border border-teal-100">
                            <strong>Response:</strong> {req.adminResponse}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          req.status === 'Open' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-navy-600 whitespace-nowrap">
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
