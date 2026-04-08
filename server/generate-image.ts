import fs from "fs/promises";
import path from "path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";

function getBackgroundGradient(theme: string): string {
  switch (theme) {
    case "saffron-glass": return "linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)";
    case "blue-slate": return "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)";
    case "minimal-light": return "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
    case "dark-hacker": return "linear-gradient(135deg, #09090b 0%, #18181b 100%)";
    case "ruby-red": return "linear-gradient(135deg, #450a0a 0%, #dc2626 100%)";
    case "emerald-city": return "linear-gradient(135deg, #064e3b 0%, #10b981 100%)";
    case "purple-nebula": return "linear-gradient(135deg, #2e1065 0%, #8b5cf6 100%)";
    case "midnight-gold": return "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #b45309 100%)";
    case "ocean-wave": return "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)";
    case "sunrise-glow": return "linear-gradient(135deg, #ea580c 0%, #fcd34d 100%)";
    case "metro-dark": return "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
    case "admin-pro": return "linear-gradient(180deg, #1e3a8a 0%, #ffffff 100%)";
    case "cherry-blossom": return "linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)";
    case "forest-dark": return "linear-gradient(135deg, #14532d 0%, #052e16 100%)";
    case "monochrome-steel": return "linear-gradient(135deg, #475569 0%, #94a3b8 100%)";
    default: return "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
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
  const darkThemes = ["dark-hacker", "blue-slate", "ruby-red", "purple-nebula", "midnight-gold", "metro-dark", "forest-dark", "monochrome-steel", "emerald-city"];
  const isDark = darkThemes.includes(theme);
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const boxBg = isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0";

  let bgMarkup = `<div style="display:flex;position:absolute;top:0;left:0;width:1280px;height:720px;background: ${getBackgroundGradient(theme)};"></div>`;
  if (theme === "custom" && customBgUrl) {
    try {
      let b64 = "";
      if (customBgUrl.startsWith("http")) {
        // Pass external URLs natively to Satori to prevent base64 AST bottlenecks
        bgMarkup = `<img src="${customBgUrl}" style="display:flex;position:absolute;top:0;left:0;width:1280px;height:720px;object-fit:cover;" />`;
      } else if (customBgUrl.startsWith("/uploads")) {
        // Local files must be converted to base64 because satori cannot resolve relative paths
        const localPath = path.join(process.cwd(), customBgUrl);
        const fileBuf = await fs.readFile(localPath);
        const ext = path.extname(localPath).toLowerCase().substring(1) || "jpeg";
        const cleanExt = ext === "jpg" ? "jpeg" : ext;
        b64 = `data:image/${cleanExt};base64,${fileBuf.toString('base64')}`;
      }
      
      if (b64) {
        bgMarkup = `<img src="${b64}" style="display:flex;position:absolute;top:0;left:0;width:1280px;height:720px;object-fit:cover;" />`;
      }
    } catch (e) {
      console.warn("Satori Custom BG Error: Failed to buffer image, falling back.", e);
    }
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
              GovtJobNow.com - Official Updates
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
