import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

export const enhanceProfessionalSummary = async (req, res) => {
  console.log("enhanceProfessionalSummary called");

  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert in resume writing.

Enhance the following professional summary.
Keep it to 1-2 sentences.
Make it ATS-friendly.
Return only the improved text.

${userContent}
`;

    const result = await model.generateContent(prompt);

    const enhancedContent = result.response.text();

    return res.status(200).json({
      enhancedContent,
    });
  } catch (error) {
    console.log("AI ERROR:", error);
    console.log("AI ERROR MESSAGE:", error.message);

    return res.status(400).json({
      message: error.message,
    });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert in resume writing.

Enhance the following job description.
Keep it to 1-2 sentences.
Highlight responsibilities and achievements.
Use action verbs and ATS-friendly language.
Return only the improved text.

${userContent}
`;

    const result = await model.generateContent(prompt);

    const enhancedContent = result.response.text();

    return res.status(200).json({
      enhancedContent,
    });
  } catch (error) {
    console.log("AI ERROR:", error);
    console.log("AI ERROR MESSAGE:", error.message);

    return res.status(400).json({
      message: error.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { resumeText, title } = req.body;
    const userId = req.userId;

    console.log("resumeText =", resumeText);
    console.log("title =", title);

    if (!resumeText) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Extract information from the resume below.

Resume:
${resumeText}

Return ONLY valid JSON in this format:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

Do not return markdown.
Do not return explanations.
Return only JSON.
`;

    const result = await model.generateContent(prompt);

    const extractedData = result.response.text();

    const cleanJson = extractedData
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanJson);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.json({
      resumeId: newResume._id,
    });
  } catch (error) {
    console.log("UPLOAD RESUME ERROR:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};