GLUSENSE WEBSITE UPGRADE

Files in this folder replace the matching files in your Glusense.proto GitHub repository.

Included upgrades:
- Dashboard step tracker (local browser demo count, 8,000-step goal)
- Expanded food library (80+ food options) with automatic suggestions, filters, search, selection and plate review
- More detailed simulated NFC scan flow with staged checks, sample quality and timestamps
- Local demo reading history and analytics
- Existing dark cyan GluSense visual identity retained

HOW TO PUBLISH TO GITHUB PAGES
1. Download and unzip this archive.
2. Open https://github.com/Maharaja3117m/Glusense.proto
3. Replace the matching root HTML files, css/style.css and js/app.js with the versions in this folder.
4. Commit the changes to the main branch.
5. Wait for GitHub Pages to redeploy, then refresh your website.

IMPORTANT TECHNICAL NOTE
This remains a frontend-only prototype. Glucose values and scan quality are synthetic demo values. Step count is manually incremented demo data and is not read from a real motion sensor. NFC is simulated; this website does not measure glucose or connect to hardware. Do not use the demo values for health decisions.
