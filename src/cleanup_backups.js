const fs = require('fs');
const path = require('path');

// Update this path to your actual backup directory
const backupDir = path.join(__dirname, 'backups'); // Change 'backups' to your backup directory name if different

// Set the retention period in days
const retentionDays = 1 // Change 2 to your desired retention period

const now = Date.now();

fs.readdir(backupDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(backupDir, file);
    fs.stat(filePath, (err, stat) => {
      if (err) throw err;

      const age = (now - stat.mtime.getTime()) / (1000 * 60 * 60 * 24); // Age in days
      if (age > retentionDays) {
        fs.unlink(filePath, err => {
          if (err) throw err;
          console.log(`Deleted old backup: ${file}`);
        });
      }
    });
  });
});
