import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import VolunteerProfile from '../models/VolunteerProfile.js';
import HelpRequest from '../models/HelpRequest.js';
import Assignment from '../models/Assignment.js';
import Donation from '../models/Donation.js';
import BloodDonationRequest from '../models/BloodDonationRequest.js';
import SupportCenter from '../models/SupportCenter.js';
import Notification from '../models/Notification.js';

export const seedDatabaseIfNeeded = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Seed] Database already contains ${userCount} users. Skipping seed.`);
      return;
    }

    console.log('[Seed] Database is empty. Seeding initial comprehensive sample data...');

    // Hash sample password 'password123'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Users
    const usersData = [
      {
        name: 'Dr. Sarah Mitchell (Admin)',
        email: 'admin@lifelink.org',
        password: hashedPassword,
        role: 'admin',
        phone: '+1 800-555-0199',
        city: 'Metropolis Central',
        address: '100 Lifelink Plaza, Suite 400',
        isVerified: true,
        bloodGroup: 'O+',
        isBloodDonor: true,
      },
      {
        name: 'Alex Johnson',
        email: 'citizen@lifelink.org',
        password: hashedPassword,
        role: 'citizen',
        phone: '+1 555-234-5678',
        city: 'North Hills',
        address: '42 Pine Crest Avenue',
        isVerified: true,
        bloodGroup: 'A+',
        isBloodDonor: true,
      },
      {
        name: 'Elena Rostova',
        email: 'elena.citizen@lifelink.org',
        password: hashedPassword,
        role: 'citizen',
        phone: '+1 555-876-5432',
        city: 'East Riverview',
        address: '18 Harbor View Boulevard',
        isVerified: true,
        bloodGroup: 'B-',
        isBloodDonor: false,
      },
      {
        name: 'Marcus Vance',
        email: 'volunteer@lifelink.org',
        password: hashedPassword,
        role: 'volunteer',
        phone: '+1 555-345-6789',
        city: 'Metropolis Central',
        address: '77 Beacon Street',
        isVerified: true,
        bloodGroup: 'O-',
        isBloodDonor: true,
      },
      {
        name: 'Priya Sharma (EMT)',
        email: 'priya.vol@lifelink.org',
        password: hashedPassword,
        role: 'volunteer',
        phone: '+1 555-987-6543',
        city: 'West Valley',
        address: '254 Oak Ridge Road',
        isVerified: true,
        bloodGroup: 'AB+',
        isBloodDonor: true,
      },
      {
        name: 'David Chen',
        email: 'david.vol@lifelink.org',
        password: hashedPassword,
        role: 'volunteer',
        phone: '+1 555-432-1098',
        city: 'South Gateway',
        address: '88 Commerce Drive',
        isVerified: true,
        bloodGroup: 'A-',
        isBloodDonor: true,
      },
    ];

    const createdUsers = await User.insertMany(usersData);
    const admin = createdUsers[0];
    const citizen1 = createdUsers[1];
    const citizen2 = createdUsers[2];
    const volunteer1 = createdUsers[3];
    const volunteer2 = createdUsers[4];
    const volunteer3 = createdUsers[5];

    // 2. Create Volunteer Profiles
    await VolunteerProfile.insertMany([
      {
        user: volunteer1._id,
        skills: ['First Aid', 'Logistics', 'Driving', 'Disaster Response'],
        serviceCategories: ['Medical assistance coordination', 'Food and essential supplies', 'Disaster relief support'],
        serviceAreas: ['Metropolis Central', 'North Hills'],
        availabilityStatus: 'available',
        lat: 28.6139,
        lng: 77.2090,
        contactNumber: volunteer1.phone,
        experienceNotes: 'Certified Red Cross First Responder with 3 years community dispatch experience.',
        isApprovedByAdmin: true,
        completedTasksCount: 14,
        rating: 4.9,
      },
      {
        user: volunteer2._id,
        skills: ['First Aid', 'Paramedic', 'Nurse', 'CPR'],
        serviceCategories: ['Medical assistance coordination', 'Elderly assistance'],
        serviceAreas: ['West Valley', 'Metropolis Central'],
        availabilityStatus: 'available',
        lat: 28.6250,
        lng: 77.1950,
        contactNumber: volunteer2.phone,
        experienceNotes: 'Registered Nurse (RN) willing to triage elderly and urgent medical requirements.',
        isApprovedByAdmin: true,
        completedTasksCount: 22,
        rating: 5.0,
      },
      {
        user: volunteer3._id,
        skills: ['Driving', 'Heavy Lifting', 'Food Distribution', 'Sorting'],
        serviceCategories: ['Food and essential supplies', 'Clothing donations', 'Road blockage reporting'],
        serviceAreas: ['South Gateway', 'East Riverview'],
        availabilityStatus: 'busy',
        lat: 28.5980,
        lng: 77.2200,
        contactNumber: volunteer3.phone,
        experienceNotes: 'Logistics coordinator with truck availability for bulk supplies delivery.',
        isApprovedByAdmin: true,
        completedTasksCount: 9,
        rating: 4.8,
      },
    ]);

    // 3. Create Help Requests
    const helpRequestsData = [
      {
        requestId: 'REQ-100241',
        user: citizen1._id,
        category: 'Medical assistance coordination',
        title: 'Urgent Insulin and Glucose Monitor Delivery',
        description: 'Elderly family member is isolated due to severe localized street flooding and urgently needs insulin refill and test strips.',
        location: {
          address: '42 Pine Crest Avenue, North Hills',
          city: 'North Hills',
          lat: 28.6200,
          lng: 77.2150,
        },
        priority: 'Critical',
        status: 'In Progress',
        assignedVolunteer: volunteer1._id,
        verifiedBy: admin._id,
        progressNotes: [
          {
            note: 'Request verified by Admin. Volunteer Marcus Vance assigned.',
            updatedBy: admin._id,
            updatedAt: new Date(Date.now() - 3600000 * 4),
          },
          {
            note: 'Picked up medical supplies from Apollo Pharmacy hub, in transit now.',
            updatedBy: volunteer1._id,
            updatedAt: new Date(Date.now() - 3600000 * 2),
          },
        ],
      },
      {
        requestId: 'REQ-100242',
        user: citizen2._id,
        category: 'Food and essential supplies',
        title: 'Emergency Packaged Meals & Clean Water for 6 Families',
        description: 'Water pipeline burst has cut off potable drinking water. Immediate need for 20L water cans and ready-to-eat dry ration boxes.',
        location: {
          address: '18 Harbor View Boulevard, East Riverview',
          city: 'East Riverview',
          lat: 28.6050,
          lng: 77.2350,
        },
        priority: 'High',
        status: 'Verified',
        verifiedBy: admin._id,
        progressNotes: [
          {
            note: 'Verified with local resident committee. Awaiting volunteer acceptance.',
            updatedBy: admin._id,
            updatedAt: new Date(Date.now() - 3600000 * 6),
          },
        ],
      },
      {
        requestId: 'REQ-100243',
        user: citizen1._id,
        category: 'Road blockage reporting',
        title: 'Uprooted Tree Obstructing Ambulance Route on 5th Avenue',
        description: 'Storm winds caused a mature banyan tree to fall across both lanes near the North Gate intersection. Emergency vehicles cannot pass.',
        location: {
          address: '5th Avenue & Ring Road Junction',
          city: 'Metropolis Central',
          lat: 28.6180,
          lng: 77.2020,
        },
        priority: 'Critical',
        status: 'Pending',
      },
      {
        requestId: 'REQ-100244',
        user: citizen2._id,
        category: 'Elderly assistance',
        title: 'Mobility Support and Grocery Errands for Senior Citizen',
        description: '78-year-old resident recovering from knee surgery requires assistance with grocery shopping and basic pharmacy pick-up.',
        location: {
          address: 'Apartment 4B, Sunrise Enclave',
          city: 'West Valley',
          lat: 28.6290,
          lng: 77.1920,
        },
        priority: 'Medium',
        status: 'Completed',
        assignedVolunteer: volunteer2._id,
        verifiedBy: admin._id,
        completedAt: new Date(Date.now() - 3600000 * 24),
        progressNotes: [
          {
            note: 'Assigned to Nurse Priya.',
            updatedBy: admin._id,
            updatedAt: new Date(Date.now() - 3600000 * 30),
          },
          {
            note: 'Groceries and prescribed medications delivered safely. Resident doing well.',
            updatedBy: volunteer2._id,
            updatedAt: new Date(Date.now() - 3600000 * 24),
          },
        ],
      },
      {
        requestId: 'REQ-100245',
        user: citizen1._id,
        category: 'Disaster relief support',
        title: 'Dry Blankets and Tarpaulins for Waterlogged Shelter',
        description: 'Basement temporary shelter has minor water seepage. Need waterproof tarps and 30 warm fleece blankets.',
        location: {
          address: 'Community Hall, Sector 8',
          city: 'South Gateway',
          lat: 28.5940,
          lng: 77.2180,
        },
        priority: 'High',
        status: 'Verified',
        verifiedBy: admin._id,
      },
    ];

    const createdRequests = await HelpRequest.insertMany(helpRequestsData);

    // 4. Create Assignment for the in-progress request
    await Assignment.create({
      request: createdRequests[0]._id,
      volunteer: volunteer1._id,
      assignedBy: admin._id,
      status: 'Accepted',
      notes: 'Urgent medical assistance delivery',
      timeline: [
        {
          status: 'Offered',
          note: 'Assignment created by Admin Dr. Sarah Mitchell',
          timestamp: new Date(Date.now() - 3600000 * 4),
        },
        {
          status: 'Accepted',
          note: 'Accepted by volunteer Marcus Vance',
          timestamp: new Date(Date.now() - 3600000 * 3.5),
        },
        {
          status: 'In Progress',
          note: 'Medication collected from pharmacy dispensary',
          timestamp: new Date(Date.now() - 3600000 * 2),
        },
      ],
    });

    // 5. Create Community Support Centers
    await SupportCenter.insertMany([
      {
        name: 'Metropolis Central Relief & First Aid Hub',
        type: 'Medical Center',
        address: '10 Civil Lines, Opposite Civic Center',
        city: 'Metropolis Central',
        lat: 28.6145,
        lng: 77.2085,
        contactNumber: '+1 800-HELP-01',
        operationalHours: '24/7',
        capacity: 250,
        currentOccupancy: 84,
        resourcesAvailable: ['Trauma Kits', 'Emergency Oxygen', 'Clean Water', 'Ambulance Standby'],
        isActive: true,
      },
      {
        name: 'North Hills Community Food Bank & Shelter',
        type: 'Food Distribution Center',
        address: '55 Green Meadows Way',
        city: 'North Hills',
        lat: 28.6310,
        lng: 77.2190,
        contactNumber: '+1 800-FOOD-02',
        operationalHours: '06:00 AM - 10:00 PM',
        capacity: 400,
        currentOccupancy: 120,
        resourcesAvailable: ['Packed Meals', 'Baby Formula', 'Drinking Water', 'Blankets'],
        isActive: true,
      },
      {
        name: 'East Riverview Emergency Dispatch Post',
        type: 'Emergency Dispatch',
        address: 'Pier 9 Logistics Yard',
        city: 'East Riverview',
        lat: 28.6010,
        lng: 77.2410,
        contactNumber: '+1 800-DISPATCH-03',
        operationalHours: '24/7',
        capacity: 150,
        currentOccupancy: 45,
        resourcesAvailable: ['Rescue Boats', 'Generators', 'First Aid', 'High-Vis Vests'],
        isActive: true,
      },
      {
        name: 'South Gateway Transit Shelter & Relief Camp',
        type: 'Shelter',
        address: 'Sector 14 Stadium Complex',
        city: 'South Gateway',
        lat: 28.5890,
        lng: 77.2150,
        contactNumber: '+1 800-CAMP-04',
        operationalHours: '24/7',
        capacity: 600,
        currentOccupancy: 310,
        resourcesAvailable: ['Cots', 'Warm Meals', 'Sanitation Kits', 'Medical Tents'],
        isActive: true,
      },
    ]);

    // 6. Create Resource Donations
    await Donation.insertMany([
      {
        donor: citizen1._id,
        title: '50 Sealed Care Packages (Dry Rations & Canned Goods)',
        category: 'Food',
        quantity: 50,
        unit: 'kits',
        pickupLocation: {
          address: '42 Pine Crest Avenue, North Hills',
          city: 'North Hills',
          lat: 28.6210,
          lng: 77.2140,
        },
        status: 'Available',
        expiryDate: new Date(Date.now() + 86400000 * 90),
        notes: 'Each kit contains lentils, rice, energy biscuits, and chlorine purification tablets.',
      },
      {
        donor: volunteer3._id,
        title: 'Winter Warmth Clothes & Thermal Jackets (Assorted Adult Sizes)',
        category: 'Clothes',
        quantity: 35,
        unit: 'sets',
        pickupLocation: {
          address: '88 Commerce Drive, South Gateway',
          city: 'South Gateway',
          lat: 28.5990,
          lng: 77.2210,
        },
        status: 'Available',
        notes: 'Cleaned, sanitized and sorted by size (M, L, XL). Ready for immediate handover.',
      },
      {
        donor: citizen2._id,
        title: 'First Aid Emergency Trauma Bags (Grade A)',
        category: 'Essential Supplies',
        quantity: 15,
        unit: 'bags',
        pickupLocation: {
          address: '18 Harbor View Boulevard, East Riverview',
          city: 'East Riverview',
          lat: 28.6040,
          lng: 77.2360,
        },
        status: 'Available',
        notes: 'Includes sterile gauze, antiseptic wash, burn dressings, splints, and shears.',
      },
      {
        donor: admin._id,
        title: 'School Stationery & Children Activity Books',
        category: 'Educational Materials',
        quantity: 100,
        unit: 'sets',
        pickupLocation: {
          address: '100 Lifelink Plaza',
          city: 'Metropolis Central',
          lat: 28.6140,
          lng: 77.2095,
        },
        status: 'Available',
        notes: 'Notebooks, colored pencils, and reading books for children in temporary displacement camps.',
      },
    ]);

    // 7. Create Blood Donation Requests
    await BloodDonationRequest.insertMany([
      {
        patientName: 'Patient #EM-9081 (Emergency Surgery)',
        bloodGroup: 'O-',
        unitsNeeded: 3,
        hospitalName: 'Metropolis General Hospital - Trauma ICU',
        hospitalAddress: {
          address: 'Medical Enclave, Central Ave',
          city: 'Metropolis Central',
          lat: 28.6160,
          lng: 77.2070,
        },
        urgency: 'Immediate',
        status: 'Active',
        adminApproved: true,
        verifiedBy: admin._id,
        contactPerson: 'Dr. Robert Hayes (Blood Bank In-Charge)',
        contactPhone: '+1 555-BLOOD-01',
        additionalNotes: 'Urgent donor required for immediate matching. Universal donor O- preferred.',
        createdBy: admin._id,
        matchedDonorsCount: 4,
      },
      {
        patientName: 'Patient #PD-4412 (Pediatric Anemia)',
        bloodGroup: 'A+',
        unitsNeeded: 2,
        hospitalName: 'Children City Hospital',
        hospitalAddress: {
          address: '77 Hope Street',
          city: 'West Valley',
          lat: 28.6280,
          lng: 77.1940,
        },
        urgency: 'Urgent',
        status: 'Active',
        adminApproved: true,
        verifiedBy: admin._id,
        contactPerson: 'Nurse Supervisor Angela',
        contactPhone: '+1 555-BLOOD-02',
        additionalNotes: 'Scheduled transfusion for tomorrow 10:00 AM.',
        createdBy: citizen1._id,
        matchedDonorsCount: 8,
      },
      {
        patientName: 'Patient #TH-1190 (Thalassemia Care)',
        bloodGroup: 'B+',
        unitsNeeded: 1,
        hospitalName: 'Apex Life Sciences Hospital',
        hospitalAddress: {
          address: 'Sector 5 Health Hub',
          city: 'North Hills',
          lat: 28.6320,
          lng: 77.2180,
        },
        urgency: 'Normal',
        status: 'Pending Approval',
        adminApproved: false,
        contactPerson: 'Kavita Verma',
        contactPhone: '+1 555-BLOOD-03',
        additionalNotes: 'Monthly routine transfusion support.',
        createdBy: citizen2._id,
        matchedDonorsCount: 6,
      },
    ]);

    // 8. Create In-App Notifications
    await Notification.insertMany([
      {
        recipient: citizen1._id,
        title: 'Volunteer Assigned to Your Request',
        message: 'Marcus Vance has accepted your request #REQ-100241 and is currently en route.',
        type: 'assignment',
        link: '/citizen/my-requests',
        isRead: false,
      },
      {
        recipient: volunteer1._id,
        title: 'Assignment In Progress',
        message: 'Please update your status once delivery for request #REQ-100241 is safely handed over.',
        type: 'assignment',
        link: '/volunteer/assignments',
        isRead: false,
      },
      {
        recipient: admin._id,
        title: 'New Road Obstruction Reported',
        message: 'New Critical Road Blockage reported at 5th Avenue & Ring Road Junction.',
        type: 'request',
        link: '/admin/requests',
        isRead: false,
      },
    ]);

    console.log('[Seed] Database successfully populated with realistic LifeLink demo records!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};
