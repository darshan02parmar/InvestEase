const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Statement = require('../models/Statement');
const Portfolio = require('../models/Portfolio');
const SIP = require('../models/SIP');

const getStatements = async (req, res) => {
  try {
    const statements = await Statement.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(statements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateStatement = async (req, res) => {
  const { month, year } = req.body;

  try {
    // Check if statement already exists
    const existingStatement = await Statement.findOne({ userId: req.user._id, month, year });
    if (existingStatement) {
      return res.status(400).json({ message: 'Statement for this month and year already exists.' });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const sips = await SIP.find({ userId: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found to generate statement.' });
    }

    const dir = 'uploads/statements/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = `${req.user._id}-statement-${month}-${year}.pdf`;
    const filepath = path.join(dir, filename);

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filepath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#0d9488').text('InvestEase', { align: 'right' });
    doc.fontSize(10).fillColor('#486581').text('Digital Investor Operations Platform', { align: 'right' });
    doc.moveDown();
    
    doc.fontSize(20).fillColor('#102a43').text(`Account Statement`, { align: 'left' });
    doc.fontSize(12).fillColor('#486581').text(`Period: ${month} ${year}`, { align: 'left' });
    doc.moveDown(2);

    // Investor Details
    doc.fontSize(14).fillColor('#102a43').text('Investor Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#334e68');
    doc.text(`Name: ${req.user.name}`);
    doc.text(`Email: ${req.user.email}`);
    doc.text(`Mobile: ${req.user.mobile}`);
    doc.text(`KYC Status: ${req.user.kycStatus}`);
    doc.moveDown(2);

    // Portfolio Summary
    doc.fontSize(14).fillColor('#102a43').text('Portfolio Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#334e68');
    doc.text(`Total Portfolio Value: Rs. ${portfolio.totalValue.toLocaleString()}`);
    
    // Draw a simple box for allocation
    doc.moveDown();
    doc.rect(50, doc.y, 500, 60).stroke('#bcccdc');
    doc.text(`Equity: ${portfolio.allocation.equity}%`, 60, doc.y + 10);
    doc.text(`Debt: ${portfolio.allocation.debt}%`, 250, doc.y - 12);
    doc.text(`Liquid: ${portfolio.allocation.liquid}%`, 440, doc.y - 12);
    doc.moveDown(4);

    // SIP Summary
    doc.fontSize(14).fillColor('#102a43').text('Systematic Investment Plans (SIPs)', { underline: true });
    doc.moveDown(1);
    
    if (sips.length === 0) {
      doc.fontSize(10).text('No active SIPs found for this period.');
    } else {
      let yPosition = doc.y;
      doc.fontSize(10).fillColor('#102a43').font('Helvetica-Bold');
      doc.text('Fund Name', 50, yPosition);
      doc.text('Amount', 300, yPosition);
      doc.text('Status', 400, yPosition);
      doc.text('Next Debit', 480, yPosition);
      
      doc.moveTo(50, yPosition + 15).lineTo(550, yPosition + 15).stroke('#bcccdc');
      
      doc.font('Helvetica');
      yPosition += 25;
      
      sips.forEach(sip => {
        doc.fillColor('#334e68');
        doc.text(sip.fundName, 50, yPosition, { width: 240 });
        doc.text(`Rs. ${sip.amount}`, 300, yPosition);
        doc.text(sip.status, 400, yPosition);
        doc.text(new Date(sip.nextDebit).toLocaleDateString(), 480, yPosition);
        yPosition += 25;
      });
    }

    // Footer
    doc.fontSize(8).fillColor('#829ab1').text(
      'This is a computer-generated statement and does not require a signature.',
      50, 700, { align: 'center' }
    );

    doc.end();

    writeStream.on('finish', async () => {
      const statement = await Statement.create({
        userId: req.user._id,
        month,
        year,
        pdfUrl: `uploads/statements/${filename}`
      });
      res.status(201).json(statement);
    });

    writeStream.on('error', (err) => {
      res.status(500).json({ message: 'Failed to generate PDF document.' });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStatements,
  generateStatement
};
