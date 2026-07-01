const SIP = require('../models/SIP');

const getSIPs = async (req, res) => {
  try {
    const sips = await SIP.find({ userId: req.user._id }).sort({ nextDebit: 1 });
    res.json(sips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const retrySIP = async (req, res) => {
  try {
    const sip = await SIP.findById(req.params.id);

    if (!sip) {
      return res.status(404).json({ message: 'SIP not found' });
    }

    if (sip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this SIP' });
    }

    if (sip.status !== 'Failed') {
      return res.status(400).json({ message: 'Only failed SIPs can be retried' });
    }

    // Simulate successful retry
    sip.status = 'Active';
    sip.failureReason = undefined;
    
    // Advance next debit date by 1 month
    const nextDate = new Date(sip.nextDebit);
    nextDate.setMonth(nextDate.getMonth() + 1);
    sip.nextDebit = nextDate;

    await sip.save();

    res.json(sip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSIPs,
  retrySIP
};
