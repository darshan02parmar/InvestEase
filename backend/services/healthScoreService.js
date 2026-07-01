const calculateHealthScore = (user, sips, nominees) => {
  let score = 0;

  // +20 if KYC approved
  if (user.kycStatus === 'Approved') score += 20;

  // +20 if at least one active SIP with no failures
  const hasActiveSip = sips.some(sip => sip.status === 'Active');
  if (hasActiveSip) score += 20;

  // +20 if at least one nominee exists
  if (nominees && nominees.length > 0) score += 20;

  // +20 if no failed SIP in the last cycle
  // Assuming if there's any 'Failed' SIP it counts against them,
  // but let's check specifically if there are no failed SIPs
  const hasFailedSip = sips.some(sip => sip.status === 'Failed');
  if (!hasFailedSip) score += 20;

  // +20 if profile fields (name, email, mobile) are all filled
  if (user.name && user.email && user.mobile) score += 20;

  let label = 'Action Required';
  if (score >= 80) {
    label = 'Healthy Portfolio';
  } else if (score >= 50) {
    label = 'Needs Attention';
  }

  const stars = Math.round(score / 20);

  return { score, stars, label };
};

module.exports = { calculateHealthScore };
