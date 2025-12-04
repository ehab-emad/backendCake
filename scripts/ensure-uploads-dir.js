const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(process.cwd(), 'uploads');
const profilePicturesDir = path.join(uploadsDir, 'customers', 'profile-pictures');

// Create directories if they don't exist
[uploadsDir, path.join(uploadsDir, 'customers'), profilePicturesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Upload directories are ready!');
