/**
 * Texas Congressional Candidates Data
 */

import { Candidate } from '../types';

export const texasCandidates: Candidate[] = [
  // District 1
  {
    id: "tx1-1",
    name: "Nathaniel Moran",
    party: "Republican",
    district_id: "district-1",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=NM",
    bio: "Nathaniel Moran represents Texas District 1. He focuses on border security, energy independence, and supporting rural communities.",
    voting_record: [
      { bill_id: "HR-1001", bill_name: "Border Security Act", vote: "yes", date: "2024-02-15" },
      { bill_id: "HR-1002", bill_name: "Energy Independence Bill", vote: "yes", date: "2024-03-20" }
    ],
    funding: { total: 1250000, sources: [
      { name: "Individual Contributions", amount: 750000, type: "individual" },
      { name: "Energy PAC", amount: 350000, type: "PAC" },
      { name: "Republican Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },
  {
    id: "tx1-2",
    name: "Maria Rodriguez",
    party: "Democratic",
    district_id: "district-1",
    status: "future",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=MR",
    bio: "Maria Rodriguez is challenging for District 1, focusing on healthcare access and rural development.",
    voting_record: null,
    funding: { total: 450000, sources: [
      { name: "Individual Contributions", amount: 320000, type: "individual" },
      { name: "Healthcare Workers PAC", amount: 130000, type: "PAC" }
    ]},
    website: "https://example.com",
    email: "info@example.com"
  },

  // District 2
  {
    id: "tx2-1",
    name: "Dan Crenshaw",
    party: "Republican",
    district_id: "district-2",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=DC",
    bio: "Dan Crenshaw is a former Navy SEAL representing Texas District 2. He focuses on veteran affairs, national security, and energy policy.",
    voting_record: [
      { bill_id: "HR-2001", bill_name: "Veterans Healthcare Expansion", vote: "yes", date: "2024-01-10" },
      { bill_id: "HR-2002", bill_name: "Defense Budget Act", vote: "yes", date: "2024-04-05" }
    ],
    funding: { total: 3200000, sources: [
      { name: "Individual Contributions", amount: 1900000, type: "individual" },
      { name: "Defense Industry PAC", amount: 800000, type: "PAC" },
      { name: "Veterans PAC", amount: 500000, type: "PAC" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 3
  {
    id: "tx3-1",
    name: "Keith Self",
    party: "Republican",
    district_id: "district-3",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=KS",
    bio: "Keith Self represents Texas District 3, focusing on fiscal conservatism, limited government, and supporting local businesses.",
    voting_record: [
      { bill_id: "HR-3001", bill_name: "Tax Relief Act", vote: "yes", date: "2024-02-28" },
      { bill_id: "HR-3002", bill_name: "Small Business Support", vote: "yes", date: "2024-05-12" }
    ],
    funding: { total: 1850000, sources: [
      { name: "Individual Contributions", amount: 1100000, type: "individual" },
      { name: "Business PACs", amount: 550000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 4
  {
    id: "tx4-1",
    name: "Pat Fallon",
    party: "Republican",
    district_id: "district-4",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=PF",
    bio: "Pat Fallon represents Texas District 4, championing conservative values, border security, and agricultural interests.",
    voting_record: [
      { bill_id: "HR-4001", bill_name: "Farm Bill Extension", vote: "yes", date: "2024-03-15" }
    ],
    funding: { total: 1450000, sources: [
      { name: "Individual Contributions", amount: 850000, type: "individual" },
      { name: "Agriculture PAC", amount: 400000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 5
  {
    id: "tx5-1",
    name: "Lance Gooden",
    party: "Republican",
    district_id: "district-5",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=LG",
    bio: "Lance Gooden represents Texas District 5, focusing on border security, job creation, and reducing federal spending.",
    voting_record: [
      { bill_id: "HR-5001", bill_name: "Border Wall Funding", vote: "yes", date: "2024-01-25" }
    ],
    funding: { total: 1320000, sources: [
      { name: "Individual Contributions", amount: 820000, type: "individual" },
      { name: "Conservative PACs", amount: 350000, type: "PAC" },
      { name: "Party Support", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 6
  {
    id: "tx6-1",
    name: "Jake Ellzey",
    party: "Republican",
    district_id: "district-6",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=JE",
    bio: "Jake Ellzey, a Navy veteran, represents Texas District 6, focusing on veteran affairs and national security.",
    voting_record: [
      { bill_id: "HR-6001", bill_name: "Veterans Support Act", vote: "yes", date: "2024-02-10" }
    ],
    funding: { total: 1100000, sources: [
      { name: "Individual Contributions", amount: 670000, type: "individual" },
      { name: "Veterans PAC", amount: 300000, type: "PAC" },
      { name: "Republican Party", amount: 130000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 7
  {
    id: "tx7-1",
    name: "Lizzie Fletcher",
    party: "Democratic",
    district_id: "district-7",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=LF",
    bio: "Lizzie Fletcher represents Texas District 7, focusing on healthcare, education, and infrastructure.",
    voting_record: [
      { bill_id: "HR-7001", bill_name: "Healthcare Access Act", vote: "yes", date: "2024-03-05" },
      { bill_id: "HR-7002", bill_name: "Education Funding Bill", vote: "yes", date: "2024-04-20" }
    ],
    funding: { total: 2150000, sources: [
      { name: "Individual Contributions", amount: 1350000, type: "individual" },
      { name: "Healthcare PAC", amount: 500000, type: "PAC" },
      { name: "Education PAC", amount: 300000, type: "PAC" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 8
  {
    id: "tx8-1",
    name: "Morgan Luttrell",
    party: "Republican",
    district_id: "district-8",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=ML",
    bio: "Morgan Luttrell, a former Navy SEAL, represents Texas District 8, championing veteran issues and border security.",
    voting_record: [
      { bill_id: "HR-8001", bill_name: "Border Security Enhancement", vote: "yes", date: "2024-01-30" }
    ],
    funding: { total: 1650000, sources: [
      { name: "Individual Contributions", amount: 980000, type: "individual" },
      { name: "Defense PAC", amount: 470000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 9
  {
    id: "tx9-1",
    name: "Al Green",
    party: "Democratic",
    district_id: "district-9",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=AG",
    bio: "Al Green has represented Texas District 9 since 2005, focusing on civil rights, economic justice, and healthcare.",
    voting_record: [
      { bill_id: "HR-9001", bill_name: "Voting Rights Act", vote: "yes", date: "2024-02-14" },
      { bill_id: "HR-9002", bill_name: "Medicare Expansion", vote: "yes", date: "2024-04-18" }
    ],
    funding: { total: 1450000, sources: [
      { name: "Individual Contributions", amount: 950000, type: "individual" },
      { name: "Civil Rights PAC", amount: 350000, type: "PAC" },
      { name: "Democratic Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 10
  {
    id: "tx10-1",
    name: "Michael McCaul",
    party: "Republican",
    district_id: "district-10",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=MM",
    bio: "Michael McCaul represents Texas District 10 and chairs the House Foreign Affairs Committee, focusing on national security.",
    voting_record: [
      { bill_id: "HR-10001", bill_name: "National Security Act", vote: "yes", date: "2024-01-20" }
    ],
    funding: { total: 2850000, sources: [
      { name: "Individual Contributions", amount: 1650000, type: "individual" },
      { name: "Defense Industry PAC", amount: 800000, type: "PAC" },
      { name: "Republican Party", amount: 400000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // Adding candidates for remaining districts 11-38
  // District 11
  {
    id: "tx11-1",
    name: "August Pfluger",
    party: "Republican",
    district_id: "district-11",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=AP",
    bio: "August Pfluger represents Texas District 11, focusing on energy independence and rural community support.",
    voting_record: null,
    funding: { total: 1250000, sources: [
      { name: "Individual Contributions", amount: 750000, type: "individual" },
      { name: "Energy PAC", amount: 400000, type: "PAC" },
      { name: "Republican Party", amount: 100000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 12
  {
    id: "tx12-1",
    name: "Kay Granger",
    party: "Republican",
    district_id: "district-12",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=KG",
    bio: "Kay Granger represents Texas District 12 and is a senior member of the Appropriations Committee.",
    voting_record: null,
    funding: { total: 1950000, sources: [
      { name: "Individual Contributions", amount: 1200000, type: "individual" },
      { name: "Business PACs", amount: 550000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 13
  {
    id: "tx13-1",
    name: "Ronny Jackson",
    party: "Republican",
    district_id: "district-13",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=RJ",
    bio: "Ronny Jackson, former White House physician, represents Texas District 13, focusing on healthcare and veteran affairs.",
    voting_record: null,
    funding: { total: 1550000, sources: [
      { name: "Individual Contributions", amount: 950000, type: "individual" },
      { name: "Healthcare PAC", amount: 400000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 14
  {
    id: "tx14-1",
    name: "Randy Weber",
    party: "Republican",
    district_id: "district-14",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=RW",
    bio: "Randy Weber represents Texas District 14, focusing on energy, coastal protection, and economic growth.",
    voting_record: null,
    funding: { total: 1350000, sources: [
      { name: "Individual Contributions", amount: 800000, type: "individual" },
      { name: "Energy PAC", amount: 400000, type: "PAC" },
      { name: "Republican Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 15
  {
    id: "tx15-1",
    name: "Monica De La Cruz",
    party: "Republican",
    district_id: "district-15",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=MD",
    bio: "Monica De La Cruz represents Texas District 15, focusing on border security and economic opportunity.",
    voting_record: null,
    funding: { total: 1150000, sources: [
      { name: "Individual Contributions", amount: 700000, type: "individual" },
      { name: "Border Security PAC", amount: 350000, type: "PAC" },
      { name: "Republican Party", amount: 100000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // Districts 16-38 (shortened for brevity - adding key districts)
  // District 18
  {
    id: "tx18-1",
    name: "Sheila Jackson Lee",
    party: "Democratic",
    district_id: "district-18",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=SJ",
    bio: "Sheila Jackson Lee has represented Texas District 18 since 1995, focusing on civil rights and criminal justice reform.",
    voting_record: [
      { bill_id: "HR-18001", bill_name: "Police Reform Act", vote: "yes", date: "2024-03-10" }
    ],
    funding: { total: 1750000, sources: [
      { name: "Individual Contributions", amount: 1100000, type: "individual" },
      { name: "Civil Rights PAC", amount: 450000, type: "PAC" },
      { name: "Democratic Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 21
  {
    id: "tx21-1",
    name: "Chip Roy",
    party: "Republican",
    district_id: "district-21",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=CR",
    bio: "Chip Roy represents Texas District 21, focusing on fiscal conservatism and border security.",
    voting_record: [
      { bill_id: "HR-21001", bill_name: "Budget Reduction Act", vote: "yes", date: "2024-02-20" }
    ],
    funding: { total: 2100000, sources: [
      { name: "Individual Contributions", amount: 1350000, type: "individual" },
      { name: "Conservative PACs", amount: 550000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 22
  {
    id: "tx22-1",
    name: "Troy Nehls",
    party: "Republican",
    district_id: "district-22",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=TN",
    bio: "Troy Nehls, a former sheriff, represents Texas District 22, focusing on law enforcement and border security.",
    voting_record: null,
    funding: { total: 1650000, sources: [
      { name: "Individual Contributions", amount: 1000000, type: "individual" },
      { name: "Law Enforcement PAC", amount: 450000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 30
  {
    id: "tx30-1",
    name: "Jasmine Crockett",
    party: "Democratic",
    district_id: "district-30",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=JC",
    bio: "Jasmine Crockett represents Texas District 30, focusing on criminal justice reform and healthcare access.",
    voting_record: [
      { bill_id: "HR-30001", bill_name: "Healthcare Expansion", vote: "yes", date: "2024-04-15" }
    ],
    funding: { total: 1350000, sources: [
      { name: "Individual Contributions", amount: 850000, type: "individual" },
      { name: "Progressive PACs", amount: 350000, type: "PAC" },
      { name: "Democratic Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 35
  {
    id: "tx35-1",
    name: "Greg Casar",
    party: "Democratic",
    district_id: "district-35",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=GC",
    bio: "Greg Casar represents Texas District 35, focusing on workers' rights, affordable housing, and progressive policies.",
    voting_record: [
      { bill_id: "HR-35001", bill_name: "Workers Rights Act", vote: "yes", date: "2024-03-25" }
    ],
    funding: { total: 1550000, sources: [
      { name: "Individual Contributions", amount: 1050000, type: "individual" },
      { name: "Labor Union PAC", amount: 350000, type: "PAC" },
      { name: "Democratic Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 37
  {
    id: "tx37-1",
    name: "Lloyd Doggett",
    party: "Democratic",
    district_id: "district-37",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=LD",
    bio: "Lloyd Doggett has represented Texas districts since 1995, focusing on healthcare, education, and consumer protection.",
    voting_record: [
      { bill_id: "HR-37001", bill_name: "Consumer Protection Act", vote: "yes", date: "2024-02-28" }
    ],
    funding: { total: 1850000, sources: [
      { name: "Individual Contributions", amount: 1200000, type: "individual" },
      { name: "Progressive PACs", amount: 450000, type: "PAC" },
      { name: "Democratic Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 16
  {
    id: "tx16-1",
    name: "Veronica Escobar",
    party: "Democratic",
    district_id: "district-16",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=VE",
    bio: "Veronica Escobar represents Texas District 16, focusing on immigration reform, healthcare, and border communities.",
    voting_record: null,
    funding: { total: 1450000, sources: [
      { name: "Individual Contributions", amount: 900000, type: "individual" },
      { name: "Progressive PACs", amount: 400000, type: "PAC" },
      { name: "Democratic Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 17
  {
    id: "tx17-1",
    name: "Pete Sessions",
    party: "Republican",
    district_id: "district-17",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=PS",
    bio: "Pete Sessions represents Texas District 17, focusing on economic growth and fiscal responsibility.",
    voting_record: null,
    funding: { total: 1650000, sources: [
      { name: "Individual Contributions", amount: 1000000, type: "individual" },
      { name: "Business PACs", amount: 450000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 19
  {
    id: "tx19-1",
    name: "Jodey Arrington",
    party: "Republican",
    district_id: "district-19",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=JA",
    bio: "Jodey Arrington represents Texas District 19, focusing on agriculture, energy, and fiscal conservatism.",
    voting_record: null,
    funding: { total: 1250000, sources: [
      { name: "Individual Contributions", amount: 750000, type: "individual" },
      { name: "Agriculture PAC", amount: 350000, type: "PAC" },
      { name: "Republican Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 20
  {
    id: "tx20-1",
    name: "Joaquin Castro",
    party: "Democratic",
    district_id: "district-20",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=JC",
    bio: "Joaquin Castro represents Texas District 20, focusing on education, healthcare, and veterans' issues.",
    voting_record: null,
    funding: { total: 1750000, sources: [
      { name: "Individual Contributions", amount: 1100000, type: "individual" },
      { name: "Education PAC", amount: 450000, type: "PAC" },
      { name: "Democratic Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 23
  {
    id: "tx23-1",
    name: "Tony Gonzales",
    party: "Republican",
    district_id: "district-23",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=TG",
    bio: "Tony Gonzales, a Navy veteran, represents Texas District 23, focusing on border security and veterans' affairs.",
    voting_record: null,
    funding: { total: 1550000, sources: [
      { name: "Individual Contributions", amount: 950000, type: "individual" },
      { name: "Veterans PAC", amount: 400000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 24
  {
    id: "tx24-1",
    name: "Beth Van Duyne",
    party: "Republican",
    district_id: "district-24",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=BV",
    bio: "Beth Van Duyne represents Texas District 24, focusing on economic growth and local government efficiency.",
    voting_record: null,
    funding: { total: 1650000, sources: [
      { name: "Individual Contributions", amount: 1000000, type: "individual" },
      { name: "Business PACs", amount: 450000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 25
  {
    id: "tx25-1",
    name: "Roger Williams",
    party: "Republican",
    district_id: "district-25",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=RW",
    bio: "Roger Williams represents Texas District 25, focusing on small business, agriculture, and veterans' issues.",
    voting_record: null,
    funding: { total: 1450000, sources: [
      { name: "Individual Contributions", amount: 850000, type: "individual" },
      { name: "Small Business PAC", amount: 400000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 26
  {
    id: "tx26-1",
    name: "Michael Burgess",
    party: "Republican",
    district_id: "district-26",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=MB",
    bio: "Michael Burgess, a physician, represents Texas District 26, focusing on healthcare policy and medical innovation.",
    voting_record: null,
    funding: { total: 1850000, sources: [
      { name: "Individual Contributions", amount: 1100000, type: "individual" },
      { name: "Healthcare PAC", amount: 550000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 27
  {
    id: "tx27-1",
    name: "Michael Cloud",
    party: "Republican",
    district_id: "district-27",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=MC",
    bio: "Michael Cloud represents Texas District 27, focusing on coastal protection and conservative values.",
    voting_record: null,
    funding: { total: 1250000, sources: [
      { name: "Individual Contributions", amount: 750000, type: "individual" },
      { name: "Conservative PACs", amount: 350000, type: "PAC" },
      { name: "Republican Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 28
  {
    id: "tx28-1",
    name: "Henry Cuellar",
    party: "Democratic",
    district_id: "district-28",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=HC",
    bio: "Henry Cuellar represents Texas District 28, focusing on border security, trade, and economic development.",
    voting_record: null,
    funding: { total: 1650000, sources: [
      { name: "Individual Contributions", amount: 1000000, type: "individual" },
      { name: "Business PACs", amount: 450000, type: "PAC" },
      { name: "Democratic Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 29
  {
    id: "tx29-1",
    name: "Sylvia Garcia",
    party: "Democratic",
    district_id: "district-29",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=SG",
    bio: "Sylvia Garcia represents Texas District 29, focusing on healthcare, education, and community development.",
    voting_record: null,
    funding: { total: 1350000, sources: [
      { name: "Individual Contributions", amount: 850000, type: "individual" },
      { name: "Education PAC", amount: 350000, type: "PAC" },
      { name: "Democratic Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 31
  {
    id: "tx31-1",
    name: "John Carter",
    party: "Republican",
    district_id: "district-31",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=JC",
    bio: "John Carter represents Texas District 31, focusing on military affairs and homeland security.",
    voting_record: null,
    funding: { total: 1750000, sources: [
      { name: "Individual Contributions", amount: 1050000, type: "individual" },
      { name: "Defense PAC", amount: 500000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 32
  {
    id: "tx32-1",
    name: "Colin Allred",
    party: "Democratic",
    district_id: "district-32",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=CA",
    bio: "Colin Allred, a former NFL player, represents Texas District 32, focusing on healthcare and education.",
    voting_record: null,
    funding: { total: 2150000, sources: [
      { name: "Individual Contributions", amount: 1350000, type: "individual" },
      { name: "Healthcare PAC", amount: 550000, type: "PAC" },
      { name: "Democratic Party", amount: 250000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 33
  {
    id: "tx33-1",
    name: "Marc Veasey",
    party: "Democratic",
    district_id: "district-33",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=MV",
    bio: "Marc Veasey represents Texas District 33, focusing on economic development and veterans' issues.",
    voting_record: null,
    funding: { total: 1450000, sources: [
      { name: "Individual Contributions", amount: 900000, type: "individual" },
      { name: "Labor Union PAC", amount: 400000, type: "PAC" },
      { name: "Democratic Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 34
  {
    id: "tx34-1",
    name: "Vicente Gonzalez",
    party: "Democratic",
    district_id: "district-34",
    status: "current",
    image_url: "https://via.placeholder.com/150/0000FF/FFFFFF?text=VG",
    bio: "Vicente Gonzalez represents Texas District 34, focusing on border security, trade, and economic growth.",
    voting_record: null,
    funding: { total: 1350000, sources: [
      { name: "Individual Contributions", amount: 850000, type: "individual" },
      { name: "Business PACs", amount: 350000, type: "PAC" },
      { name: "Democratic Party", amount: 150000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 36
  {
    id: "tx36-1",
    name: "Brian Babin",
    party: "Republican",
    district_id: "district-36",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=BB",
    bio: "Brian Babin represents Texas District 36, focusing on energy, healthcare, and conservative values.",
    voting_record: null,
    funding: { total: 1450000, sources: [
      { name: "Individual Contributions", amount: 850000, type: "individual" },
      { name: "Energy PAC", amount: 400000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  },

  // District 38
  {
    id: "tx38-1",
    name: "Wesley Hunt",
    party: "Republican",
    district_id: "district-38",
    status: "current",
    image_url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=WH",
    bio: "Wesley Hunt, an Army veteran, represents Texas District 38, focusing on national security and energy policy.",
    voting_record: null,
    funding: { total: 1750000, sources: [
      { name: "Individual Contributions", amount: 1050000, type: "individual" },
      { name: "Defense PAC", amount: 500000, type: "PAC" },
      { name: "Republican Party", amount: 200000, type: "party" }
    ]},
    website: "https://example.com",
    email: "contact@example.com"
  }
];
