import { generateFeaturedImage } from "../server/generate-image";

async function test() {
  try {
    const url = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1280&auto=format&fit=crop";
    console.log("Testing with URL", url);
    const result = await generateFeaturedImage("Test Title", "Test Dept", "B.Tech", "10", "2025-01-01", "custom", url);
    console.log("SUCCESS:", result);
  } catch(e) {
    console.error("FAIL:", e);
  }
}
test();
