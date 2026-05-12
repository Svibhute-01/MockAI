import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.js";
import User from "../models/user.model.js";

export const analyzeResume = async (req, res) => {
  let filepath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload resume." });
    }

    filepath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    // ✅ Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    // ✅ Clean text
    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const message = [
      {
        role: "system",
content: `
Extract structured data from resume.

Return ONLY valid JSON.

{
  "role":"string",
  "experience":"string",
  "projects":["project1","project2"],
  "skills":["skill1","skill2"]
}

Do not add markdown.
Do not explain anything.
`
      },
      {
        role: "user",
        content: resumeText
      }
    ];

    const aiResponse = await askAi(message);

    // ✅ Safe JSON parsing
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      throw new Error("AI returned invalid JSON");
    }

    // ✅ Delete file after processing
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });

  } catch (error) {
    console.error("Resume Analysis Error:", error.message);

    // ✅ Cleanup on error
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return res.status(500).json({ message: error.message });
  }
};


export const generateQuestion=async(req,res)=>{
  try {
    const {role,experience,mode,resumeText,projects,skills}=req.body
    role=role?.trim();
    experience=experience?.trim();
    mode=mode?.trim();
    if(!role || !experience||!mode){
      return res.ststus(400).json({message:"role,experince and mode are required"});

    }

    const user=await User.findById(req.userId)


    if(!user){
      return res.ststus(400).json({message:"user not found"});

    }

    if(user.credits<50){
      return res.ststus(400).json({message:"Insufficient credits"});

    }

    const projectText=Array.isArray(projects)&& projects.length? projects.join(", ")
    :"None";
    const skillsText=Array.isArray(skills)&& skills.length? skills.join(", ")
    :"None";

    const safeResume=resumeText?.trim()||"None";



  } catch (error) {
    
  }
}