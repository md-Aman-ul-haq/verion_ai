const fs = require('fs');

let content = fs.readFileSync('c:/Users/Admin/Desktop/verion_ai/frontend/src/pages/LandingPage.tsx', 'utf8');

// We want to replace the dark styling with light styling for sections that use `methodBg`
// We will simply regex out the background image div, and change bg-black to bg-[#faf9f6],
// and flip the text colors back for these specific sections.

const revertSection = (startMarker, endMarker) => {
    let startIdx = content.indexOf(startMarker);
    if (startIdx === -1) return;
    let endIdx = content.indexOf(endMarker, startIdx);
    if (endIdx === -1) return;
    
    let section = content.substring(startIdx, endIdx);
    
    // Remove the methodBg div
    section = section.replace(/<div className="absolute inset-0 z-0 opacity-65" style={{ backgroundImage: `url\(\$\{methodBg\}\)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} \/>\s*/g, '');
    section = section.replace(/<div className="absolute inset-0 z-0 opacity-65" style={{ backgroundImage: `url\(\$\{methodBg\}\)`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} \/>\s*/g, '');
    
    // Also the one with multi-line styling
    section = section.replace(/<div\s*className="absolute inset-0 z-0 opacity-65"\s*style={{\s*backgroundImage: `url\(\$\{methodBg\}\)`,\s*backgroundSize: 'cover',\s*backgroundPosition: 'center',\s*backgroundAttachment: 'fixed',\s*}}\s*\/>\s*/g, '');

    // Colors
    section = section.replace(/bg-black/g, 'bg-[#faf9f6]');
    section = section.replace(/text-white relative bg-\[\#faf9f6\]/g, 'text-zinc-950 relative bg-[#faf9f6]');
    section = section.replace(/text-white/g, 'text-zinc-950');
    section = section.replace(/text-zinc-400/g, 'text-zinc-500');
    section = section.replace(/text-zinc-300/g, 'text-zinc-600');
    
    // Cards
    section = section.replace(/bg-zinc-900\/60/g, 'bg-white/85');
    section = section.replace(/bg-zinc-900\/40/g, 'bg-white/80');
    
    // Borders
    section = section.replace(/border-zinc-700\/60/g, 'border-zinc-500');
    section = section.replace(/border-white\/5/g, 'border-zinc-200');
    section = section.replace(/border-white\/20/g, 'border-zinc-300');
    section = section.replace(/hover:border-zinc-700\/40/g, 'hover:border-zinc-500');
    section = section.replace(/hover:border-white\/40/g, 'hover:border-zinc-400');
    
    // Hover backgrounds
    section = section.replace(/hover:bg-zinc-800/g, 'hover:bg-zinc-200');
    
    // Shadows
    section = section.replace(/shadow-\[0_12px_28px_rgba\(0,0,0,0\.30\)\]/g, 'shadow-[0_12px_28px_rgba(0,0,0,0.10)]');
    section = section.replace(/hover:shadow-\[0_8px_20px_rgba\(0,0,0,0\.2\)\]/g, 'hover:shadow-md');
    
    // Borders for sections
    section = section.replace(/border-b border-zinc-900/g, 'border-b border-zinc-200');
    section = section.replace(/border-t border-zinc-900/g, 'border-t border-zinc-200');
    section = section.replace(/border-t border-b border-zinc-900/g, 'border-t border-b border-zinc-200');
    
    content = content.substring(0, startIdx) + section + content.substring(endIdx);
};

revertSection('{/* ── Integrations / Logo Bar (Dark) ── */}', '{/* ── Problem Section (Dark) ── */}');
revertSection('{/* ── Solution Section ── */}', '{/* ── Features Section (Light) ── */}');
revertSection('{/* ── Features Section (Light) ── */}', '{/* ── Dashboard Preview & Before vs After (Dark) ── */}');
revertSection('{/* ── 3-Phase Method (Interactive, Vertical) ── */}', '{/* ── Benefits Section ── */}');
revertSection('{/* ── Benefits Section ── */}', '{/* ── Technology Section (Dark) ── */}');
revertSection('{/* ── Testimonials Section (Dark) ── */}', '{/* ── FAQ Section (Dark) ── */}');

// Finally, if methodBg is no longer used, remove the import
if (content.indexOf('minimal_black_bg.png') === -1 || content.indexOf('methodBg') === -1) {
    // Keep it just in case, but usually we would remove it
}

fs.writeFileSync('c:/Users/Admin/Desktop/verion_ai/frontend/src/pages/LandingPage.tsx', content);
