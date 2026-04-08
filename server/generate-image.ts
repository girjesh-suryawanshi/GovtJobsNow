import fs from "fs/promises";
import path from "path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";

function getBackgroundGradient(theme: string): string {
  switch (theme) {
    case "saffron-glass":
      return "linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)";
    case "blue-slate":
      return "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)";
    case "minimal-light":
      return "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
    case "dark-hacker":
      return "linear-gradient(135deg, #09090b 0%, #18181b 100%)";
    default:
      return "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
  }
}

export async function generateFeaturedImage(
  title: string, 
  department: string, 
  qualification: string, 
  positions: string = "1", 
  deadline: string = "",
  theme: string = "saffron-glass",
  customBgUrl: string = ""
): Promise<string> {
  console.log(`Generating Satori image using theme [${theme}]...`);
  
  // 1. Load Font Buffer
  const fontPath = path.join(process.cwd(), "uploads", "fonts", "Roboto-Bold.ttf");
  const fontBuffer = await fs.readFile(fontPath);

  // 2. Build template HTML
  const isDark = theme === "dark-hacker" || theme === "blue-slate";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const boxBg = isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)";
  const borderColor = isDark ? "#334155" : "#e2e8f0";

  let bgMarkup = `<div style="display:flex;position:absolute;top:0;left:0;width:1280px;height:720px;background: ${getBackgroundGradient(theme)};"></div>`;
  if (theme === "custom" && customBgUrl) {
    // Note: Satori requires absolute URLs for images, or base64. 
    // If it's a local path like /uploads/..., we have to convert it or provide a full localhost URL.
    // Assuming customBgUrl is an absolute path or we can prefix it.
    let fullUrl = customBgUrl;
    if (customBgUrl.startsWith("/uploads")) {
       const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
       const host = process.env.HOST || "localhost";
       const port = process.env.PORT || "3000";
       fullUrl = `${protocol}://${host}:${port}${customBgUrl}`;
    }
    bgMarkup = `<img src="${fullUrl}" style="position:absolute;top:0;left:0;width:1280px;height:720px;object-fit:cover;" />`;
  }

  const htmlString = `
    <div style="display:flex;width:1280px;height:720px;flex-direction:column;font-family:'Roboto'; position:relative;">
      ${bgMarkup}
      
      <div style="display:flex;flex-direction:column;padding:60px;width:100%;height:100%;justify-content:space-between;">
         <div style="display:flex;flex-direction:column;background:${boxBg};padding:40px;border-radius:24px;border: 2px solid ${borderColor};box-shadow:0 10px 40px rgba(0,0,0,0.1);">
             <div style="display:flex;font-size:32px;font-weight:bold;color:${isDark ? '#38bdf8' : '#2563eb'};text-transform:uppercase;margin-bottom:15px;">${department || "LATEST JOB UPDATE"}</div>
             <div style="display:flex;font-size:64px;font-weight:bold;line-height:1.1;color:${textColor};">${title}</div>
         </div>
         
         <div style="display:flex;justify-content:space-between;background:${boxBg};padding:30px 40px;border-radius:20px;border: 2px solid ${borderColor};box-shadow:0 10px 40px rgba(0,0,0,0.1);">
             <div style="display:flex;flex-direction:column;">
                <div style="display:flex;font-size:24px;color:${isDark ? '#94a3b8' : '#64748b'};">Qualification</div>
                <div style="display:flex;font-size:36px;font-weight:bold;color:${textColor};">${qualification || "Check Details"}</div>
             </div>
             <div style="display:flex;flex-direction:column;border-left:3px solid ${borderColor};padding-left:40px;">
                <div style="display:flex;font-size:24px;color:${isDark ? '#94a3b8' : '#64748b'};">Positions</div>
                <div style="display:flex;font-size:36px;font-weight:bold;color:${textColor};">${positions}</div>
             </div>
             <div style="display:flex;flex-direction:column;border-left:3px solid ${borderColor};padding-left:40px;">
                <div style="display:flex;font-size:24px;color:${isDark ? '#94a3b8' : '#64748b'};">Last Date</div>
                <div style="display:flex;font-size:36px;font-weight:bold;color:${isDark ? '#f87171' : '#dc2626'};">${deadline || "Apply ASAP"}</div>
             </div>
         </div>

         <div style="display:flex;justify-content:center;margin-top:20px;">
            <div style="display:flex;font-size:28px;font-weight:bold;color:#ffffff;background:rgba(0,0,0,0.8);padding:15px 40px;border-radius:100px;">
              GovtJobsNow.com - Official Updates
            </div>
         </div>
      </div>
    </div>
  `;

  // 3. Render SVG natively through Satori
  const element = html(htmlString);
  const svgText = await satori(element as React.ReactNode, {
    width: 1280,
    height: 720,
    fonts: [
      {
        name: 'Roboto',
        data: fontBuffer,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  // 4. Convert SVG to PNG using resvg
  const resvg = new Resvg(svgText, {
    fitTo: { mode: 'width', value: 1280 },
  });
  
  const pngData = resvg.render().asPng();

  // Ensure global uploads directory exists to match Express static serving
  const uploadDir = path.join(process.cwd(), "uploads");
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const filename = `featured-${Date.now()}.png`;
  const filepath = path.join(uploadDir, filename);

  await fs.writeFile(filepath, Buffer.from(pngData));

  return `/uploads/${filename}`;
}
