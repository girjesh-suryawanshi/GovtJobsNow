import satori from 'satori';
import { html } from 'satori-html';

async function test() {
  console.log("Start", Date.now());
  const element = html(`<div style="display:flex;"><img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1280&auto=format&fit=crop" style="width:100px; height:100px; object-fit: cover;" /></div>`);
  const svg = await satori(element as any, {
    width: 100,
    height: 100,
    fonts: [{
      name: 'Roboto',
      data: new ArrayBuffer(0),
      weight: 400,
      style: 'normal',
    }],
  }).catch(e => { console.log("satori error:", e); return ""; });
  console.log("End", Date.now());
  console.log("SVG size:", svg.length);
}
test();
