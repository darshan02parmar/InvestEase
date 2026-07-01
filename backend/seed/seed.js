const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');

const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const SIP = require('../models/SIP');
const Nominee = require('../models/Nominee');
const Statement = require('../models/Statement');
const Request = require('../models/Request');
const Notification = require('../models/Notification');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Portfolio.deleteMany();
    await SIP.deleteMany();
    await Nominee.deleteMany();
    await Statement.deleteMany();
    await Request.deleteMany();
    await Notification.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash('Demo@123', salt);
    const adminPassword = await bcrypt.hash('Admin@123', salt);

    const users = await User.insertMany([
      {
        name: 'Demo Investor',
        email: 'demo@investease.com',
        password: demoPassword,
        mobile: '1234567890',
        kycStatus: 'Approved',
        role: 'investor'
      },
      {
        name: 'Admin User',
        email: 'admin@investease.com',
        password: adminPassword,
        mobile: '0987654321',
        kycStatus: 'Approved',
        role: 'admin'
      }
    ]);

    const demoUser = users[0];

    await Portfolio.create({
      userId: demoUser._id,
      totalValue: 500000,
      todayChange: 1500,
      allocation: {
        equity: 60,
        debt: 30,
        liquid: 10
      }
    });

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    await SIP.insertMany([
      {
        userId: demoUser._id,
        fundName: 'InvestEase Bluechip Equity Fund',
        amount: 5000,
        frequency: 'Monthly',
        status: 'Active',
        nextDebit: nextMonth
      },
      {
        userId: demoUser._id,
        fundName: 'InvestEase Liquid Fund',
        amount: 2000,
        frequency: 'Monthly',
        status: 'Failed',
        nextDebit: lastMonth,
        failureReason: 'Insufficient Funds'
      }
    ]);

    await Nominee.create({
      userId: demoUser._id,
      name: 'Jane Doe',
      relationship: 'Spouse',
      dob: new Date('1990-01-01'),
      mobile: '9876543210',
      email: 'jane@example.com',
      share: 100
    });

    await Request.insertMany([
      {
        userId: demoUser._id,
        type: 'Bank Mandate Update',
        description: 'Update my primary bank account for SIP deductions.',
        status: 'In Progress'
      },
      {
        userId: demoUser._id,
        type: 'Address Change',
        description: 'Update residential address.',
        status: 'Submitted'
      }
    ]);

    await Notification.insertMany([
      {
        userId: demoUser._id,
        title: 'Action Required: KYC Pending',
        message: 'Please complete your KYC to unlock full platform features.',
        type: 'Action'
      },
      {
        userId: demoUser._id,
        title: 'SIP Reminder',
        message: 'Your upcoming SIP for HDFC Liquid Fund is scheduled for Nov 15.',
        type: 'Reminder'
      },
      {
        userId: demoUser._id,
        title: 'Nominee Successfully Added',
        message: 'Jane Doe was successfully added as your nominee with 100% share.',
        type: 'Success',
        read: true
      },
      {
        userId: demoUser._id,
        title: 'New Fund Offer (NFO)',
        message: 'Invest in the new XYZ Technology Fund today. Offer closes soon.',
        type: 'Info'
      },
      {
        userId: demoUser._id,
        title: 'SIP Payment Failed',
        message: 'Your SIP for InvestEase Liquid Fund failed due to insufficient funds.',
        type: 'Alert',
        read: false
      },
      {
        userId: demoUser._id,
        title: 'Portfolio Update',
        message: 'Your portfolio crossed the ₹5,00,000 mark!',
        type: 'Info',
        read: false
      }
    ]);

    console.log('Mock Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
