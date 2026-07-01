const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const SIP = require('../models/SIP');
const Nominee = require('../models/Nominee');
const Notification = require('../models/Notification');
const Request = require('../models/Request');
const { calculateHealthScore } = require('../services/healthScoreService');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const portfolio = await Portfolio.findOne({ userId });
    const sips = await SIP.find({ userId });
    const user = await User.findById(userId);

    const portfolioSnapshot = portfolio || { totalValue: 0, todayChange: 0, allocation: { equity: 0, debt: 0, liquid: 0 } };
    const healthScore = calculateHealthScore(req.user, sips, await Nominee.find({ userId }));

    const sipDetails = {
      totalActiveSIPs: sips.filter(s => s.status === 'Active').length,
      totalSIPAmount: sips.filter(s => s.status === 'Active').reduce((sum, sip) => sum + sip.amount, 0),
      nextSIPDate: sips.length > 0 ? sips.sort((a, b) => new Date(a.nextDebit) - new Date(b.nextDebit))[0].nextDebit : null,
      failedSIPs: sips.filter(s => s.status === 'Failed').length
    };

    // Calculate Smart Insights
    const insights = [];

    // KYC Insight
    if (user.kycStatus !== 'Approved') {
      insights.push({
        type: 'warning',
        title: 'Complete your KYC',
        message: 'Some investor services remain unavailable.',
        link: '/kyc'
      });
    }

    // Nominee Insight
    const nominees = await Nominee.find({ userId: req.user._id });
    if (nominees.length === 0) {
      insights.push({
        type: 'warning',
        title: 'You haven\'t added a nominee',
        message: 'Protect your investments by adding a beneficiary.',
        link: '/nominee'
      });
    }

    // SIP Insight
    const failedSips = sips.filter(s => s.status === 'Failed');
    if (failedSips.length > 0) {
      insights.push({
        type: 'error',
        title: 'SIP Payment Failed',
        message: 'One or more of your SIPs failed. Please resolve to avoid missing investments.',
        link: '/sip'
      });
    } else if (sipDetails.nextSIPDate) {
      const daysToSIP = Math.ceil((new Date(sipDetails.nextSIPDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysToSIP >= 0 && daysToSIP <= 3) {
        insights.push({
          type: 'info',
          title: 'Your SIP is due soon',
          message: `SIP due in ${daysToSIP === 0 ? 'today' : daysToSIP + ' days'}. Maintain sufficient balance.`,
          link: '/sip'
        });
      }
    }

    // Notifications Insight
    const unreadNotifications = await Notification.countDocuments({ userId: req.user._id, read: false });
    if (unreadNotifications > 0) {
      insights.push({
        type: 'info',
        title: `${unreadNotifications} unread notification${unreadNotifications > 1 ? 's' : ''}`,
        message: 'You have new notifications that require your attention.',
        link: '/notifications'
      });
    }

    // Generic Insight
    insights.push({
      type: 'success',
      title: 'Download this month\'s statement',
      message: 'Keep track of your portfolio growth.',
      link: '/statements'
    });

    const recentActivity = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5);

    const nextSip = sips.find(s => s.status === 'Active') || null;

    res.json({
      portfolio: portfolioSnapshot,
      nextSip,
      kycStatus: user.kycStatus,
      healthScore,
      recentActivity,
      insights
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };
