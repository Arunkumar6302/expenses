const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) filelist = walkSync(dirFile, filelist);
    else if (dirFile.endsWith('.jsx')) filelist.push(dirFile);
  });
  return filelist;
};

const files = walkSync('C:/Users/rarun/Documents/EXPENSES/frontend/src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace: '${import...}/path' with `${import...}/path`
  content = content.replace(/'\$\{import\.meta\.env\.VITE_API_URL \|\| "http:\/\/localhost:5000"\}([^']*)'/g, '`$$${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
  
  // Replace: io('${import...}') with io(import.meta.env.VITE_API_URL || "http://localhost:5000")
  content = content.replace(/io\('`\$\$\{import\.meta\.env\.VITE_API_URL \|\| "http:\/\/localhost:5000"\}`'\)/g, 'io(import.meta.env.VITE_API_URL || "http://localhost:5000")');
  content = content.replace(/io\('\$\{import\.meta\.env\.VITE_API_URL \|\| "http:\/\/localhost:5000"\}([^\)]*)\)/g, 'io(import.meta.env.VITE_API_URL || "http://localhost:5000")');

  // Fix the double $$ from above replacement
  content = content.replace(/`\$\$\{/g, '`${');

  fs.writeFileSync(f, content);
});
