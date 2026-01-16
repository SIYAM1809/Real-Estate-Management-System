const fs = require('fs');
const path = require('path');

// THE "MASTER MAP" of required files
const requiredFiles = [
  // ROOT
  '.env',
  'package.json',
  
  // SERVER
  'server/config/db.js',
  'server/controllers/userController.js',
  'server/controllers/propertyController.js',
  'server/middleware/authMiddleware.js',
  'server/models/User.js',
  'server/models/Property.js',
  'server/routes/userRoutes.js',
  'server/routes/propertyRoutes.js',
  'server/server.js',

  // CLIENT
  'client/index.html',
  'client/vite.config.js',
  'client/package.json',
  'client/src/app/store.js',
  'client/src/components/Navbar.jsx',
  'client/src/components/PrivateRoute.jsx',
  'client/src/components/Spinner.jsx',
  'client/src/features/auth/authSlice.js',
  'client/src/features/auth/authService.js',
  'client/src/features/properties/propertySlice.js',
  'client/src/features/properties/propertyService.js',
  'client/src/features/favorites/favoriteService.js',
  'client/src/pages/dashboard/SellerDashboard.jsx',
  'client/src/pages/dashboard/AdminDashboard.jsx',
  'client/src/pages/AddProperty.jsx',
  'client/src/pages/Dashboard.jsx',
  'client/src/pages/Home.jsx',
  'client/src/pages/Login.jsx',
  'client/src/pages/Register.jsx',
  'client/src/pages/Properties.jsx',
  'client/src/pages/PropertyDetails.jsx',
  'client/src/App.jsx',
  'client/src/main.jsx',
  'client/src/index.css'
];

console.log("🔍 STARTING PROJECT AUDIT...\n");

let missingCount = 0;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ FOUND:   ${file}`);
  } else {
    console.error(`❌ MISSING: ${file}`); // Prints in RED if your terminal supports it
    missingCount++;
  }
});

console.log("\n------------------------------------------------");
if (missingCount === 0) {
  console.log("🎉 AUDIT PASSED: All 35 core files are present.");
} else {
  console.log(`⚠️ AUDIT FAILED: ${missingCount} files are missing!`);
  console.log("Check the list above for ❌ marks.");
}
console.log("------------------------------------------------");