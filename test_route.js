import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

async function testExtraction() {
    try {
        const { generateText } = await import('./server/gemini.ts');

        const rawText = `The Indian Institute of Banking and Finance (IIBF) is recruiting a Chief Technology Officer (CTO) on a contract basis. This senior government-linked position offers a lucrative consolidated salary and is ideal for seasoned IT professionals with extensive experience in the banking or financial sector. The role involves leading technological advancements for a premier institution. Candidates require a Bachelor’s degree in Engineering (Computer Science / Information Technology) or MCA, with a minimum of 20 years of experience in IT, preferably in PSU/Banks/Financial Institutions, including at least 3 years in a DGM/GM or similar senior IT leadership role. The maximum age limit is 62 years as of March 1, 2026. The selection process includes shortlisting based on eligibility and experience, followed by a personal interview.
    Salary Rs. 2,00,000/- per month. Number of Positions: 1. Fee: Nil. Deadline 25-03-2026`;

        const prompt = `Extract job details from the following text and return ONLY a JSON object compatible with the following schema.
      For fields with specific options, you MUST choose the closest matching option from the allowed list. If no exact match, choose the most sensible option.
      
      ALLOWED OPTIONS:
      - department: "Staff Selection Commission", "Union Public Service Commission", "Railway Recruitment Board", "Banking Sector", "Defense Services", "Public Sector Undertaking", "State Government", "Police & Security Forces", "Education & Teaching", "Healthcare & Medical", "Other Government Department"
      - location: "All India", "Pan India", "India Wide", "Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "State Wise", "Multiple Locations"
      - qualification: "10th Pass", "12th Pass", "ITI/Diploma", "Graduate (Any Stream)", "Post Graduate", "Engineering Degree", "Medical Degree", "Law Degree", "Management Degree", "Professional Qualification", "Experience Based"
      - jobCategory: "Central Government", "State Government", "PSU", "Banking", "Railway", "Defence", "Police", "Healthcare", "Education"
      - employmentType: "Permanent", "Contract", "Apprentice", "Temporary", "Part-time"
      - dates (applicationStartDate, deadline): Must strictly be in YYYY-MM-DD format.

      SCHEMA:
      {
        "title": "Job Title",
        "department": "Department Name (Must be from allowed options)",
        "location": "Location (Must be from allowed options)",
        "qualification": "Required Qualification (Must be from allowed options)",
        "deadline": "YYYY-MM-DD",
        "salary": "Salary Details",
        "description": "Full Job Description",
        "applyLink": "https://example.com/apply",
        "positions": 1,
        "ageLimit": "Age Range",
        "applicationFee": "Fee Details",
        "selectionProcess": "Process Details",
        "experienceRequired": "Experience Level",
        "jobCategory": "Category (Must be from allowed options)",
        "employmentType": "Type (Must be from allowed options)",
        "recruitingOrganization": "Organization",
        "applicationStartDate": "YYYY-MM-DD",
        "vacancyBreakdown": "Breakdown Details"
      }
      
      Text: ${rawText}`;

        const response = await generateText(prompt);
        const jsonStr = response.replace(/```json|```/g, "").trim();

        try {
            const parsed = JSON.parse(jsonStr);
            fs.writeFileSync('route_err.json', JSON.stringify({ success: true, data: parsed }, null, 2));
        } catch (parseError) {
            fs.writeFileSync('route_err.json', JSON.stringify({
                error: "Parse Error",
                textReceived: jsonStr,
                message: parseError.message
            }, null, 2));
        }

    } catch (error) {
        fs.writeFileSync('route_err.json', JSON.stringify({
            error: "Gemini Error",
            message: error.message,
            stack: error.stack
        }, null, 2));
    }
}

testExtraction();
