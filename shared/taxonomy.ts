// Taxonomy definitions for filtering system

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh', 
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
] as const;

export const UNION_TERRITORIES = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
] as const;

// Map states to their major cities/capitals for better matching
export const STATE_CITIES_MAP: Record<string, string[]> = {
  'Andhra Pradesh': ['Amaravati', 'Hyderabad', 'Vijayawada', 'Visakhapatnam'],
  'Karnataka': ['Bangalore', 'Bengaluru', 'Mysore', 'Hubli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Tamil Nadu': ['Chennai', 'Madras', 'Coimbatore', 'Madurai', 'Salem'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
  'West Bengal': ['Kolkata', 'Calcutta', 'Howrah', 'Durgapur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Calicut', 'Kozhikode'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
  'Haryana': ['Chandigarh', 'Gurgaon', 'Faridabad', 'Panipat'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Sambalpur'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'],
  'Delhi': ['New Delhi', 'Delhi', 'North Delhi', 'South Delhi']
};

// Location types for filtering
export enum LocationType {
  ALL = 'all',
  NATIONWIDE = 'nationwide', 
  MULTI_STATE = 'multi',
  STATE_SPECIFIC = 'state'
}

// Keywords that indicate nationwide/multi-location jobs
export const NATIONWIDE_KEYWORDS = [
  'all india',
  'pan india', 
  'multiple locations',
  'multiple states',
  'various locations',
  'india wide',
  'across india',
  'nationwide'
];

export const MULTI_LOCATION_KEYWORDS = [
  'multiple locations',
  'various locations', 
  'different locations',
  'several states',
  'district-wise',
  'state-wise',
  'major cities',
  'metro cities'
];

// Qualification categories
export enum QualificationCategory {
  CLASS_10 = '10th',
  CLASS_12 = '12th', 
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
  DIPLOMA = 'diploma',
  ENGINEERING = 'engineering'
}

// Qualification matching patterns
export const QUALIFICATION_PATTERNS: Record<QualificationCategory, RegExp[]> = {
  [QualificationCategory.CLASS_10]: [
    /10th\s*pass/i,
    /class\s*10/i,
    /matriculation/i,
    /secondary/i
  ],
  [QualificationCategory.CLASS_12]: [
    /12th\s*pass/i,
    /class\s*12/i,
    /intermediate/i,
    /higher\s*secondary/i,
    /plus\s*two/i
  ],
  [QualificationCategory.GRADUATE]: [
    /graduate/i,
    /graduation/i,
    /bachelor/i,
    /b\.?a\.?/i,
    /b\.?com/i,
    /b\.?sc/i,
    /b\.?ed/i,
    /degree/i,
    /any\s*discipline/i
  ],
  [QualificationCategory.POSTGRADUATE]: [
    /post\s*graduate/i,
    /postgraduate/i,
    /master/i,
    /m\.?a\.?/i,
    /m\.?com/i,
    /m\.?sc/i,
    /m\.?ed/i,
    /phd/i,
    /doctorate/i
  ],
  [QualificationCategory.DIPLOMA]: [
    /diploma/i,
    /dip\./i,
    /polytechnic/i,
    /certificate/i,
    /technical/i
  ],
  [QualificationCategory.ENGINEERING]: [
    /b\.?e\.?\//i,
    /b\.?tech/i,
    /bachelor.*engineering/i,
    /engineering/i,
    /technical/i,
    /relevant\s*field/i
  ]
};

// Department names (these should match database values)
export const DEPARTMENT_NAMES = [
  'Staff Selection Commission',
  'Union Public Service Commission', 
  'Railway Recruitment Board',
  'Indian Army',
  'Indian Navy',
  'Indian Air Force',
  'ISRO',
  'DRDO',
  'National Informatics Centre',
  'State Bank of India',
  'Punjab National Bank',
  'Canara Bank', 
  'Union Bank',
  'Reserve Bank of India',
  'Institute of Banking Personnel Selection',
  'Delhi Government',
  'Maharashtra Government',
  'Tamil Nadu Government',
  'Karnataka Government',
  'Uttar Pradesh Government',
  'Educational Institutions',
  'Forest Department',
  'Government Offices'
] as const;