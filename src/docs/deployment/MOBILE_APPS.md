# Mobile Apps - Android & iOS

Complete guide for building native Android and iOS apps from your BilltUp web app using Capacitor.

---

## Prerequisites

- ✅ Node.js 16+ installed
- ✅ Android Studio (for Android builds)
- ✅ Xcode (for iOS builds, Mac only)
- ✅ Your BilltUp app working on web

---

## Quick Setup (30 Minutes)

### Step 1: Install Capacitor Core (5 min)

```bash
cd /path/to/your/billtup/project

# Install Capacitor CLI and core
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor in your project
npx cap init BilltUp com.billtup.app --web-dir=dist
```

When prompted:
- **App name:** BilltUp
- **App ID:** com.billtup.app (or your preferred package name)
- **Web dir:** dist

---

### Step 2: Install Platform SDKs (10 min)

```bash
# Add Android support
npm install @capacitor/android
npx cap add android

# Add iOS support (Mac only)
npm install @capacitor/ios
npx cap add ios
```

---

### Step 3: Install Essential Plugins (5 min)

```bash
# NFC support for card payments
npm install @capacitor-community/nfc

# Camera for logo uploads and signature capture
npm install @capacitor/camera

# Status bar styling (match your Deep Blue theme)
npm install @capacitor/status-bar

# Haptic feedback for button presses
npm install @capacitor/haptics

# Secure storage for auth tokens
npm install @capacitor/preferences

# Keyboard management
npm install @capacitor/keyboard

# App info
npm install @capacitor/app

# Network status detection
npm install @capacitor/network
```

---

### Step 4: Configure Capacitor (5 min)

Create or update **capacitor.config.ts** in your root directory:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.billtup.app',
  appName: 'BilltUp',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1E3A8A', // Your Deep Blue primary color
      overlaysWebView: false
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1E3A8A',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;
```

---

### Step 5: Build Your Web App (2 min)

```bash
# Build your React app for production
npm run build

# Verify the dist folder is created
ls dist/
```

---

### Step 6: Sync and Open Native Projects (3 min)

```bash
# Copy web assets to native projects
npx cap sync

# Open Android Studio
npx cap open android

# OR open Xcode (Mac only)
npx cap open ios
```

---

## Android Configuration

### Update AndroidManifest.xml

Open: **android/app/src/main/AndroidManifest.xml**

Add these permissions before the `<application>` tag:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Required Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- NFC Payment Support -->
    <uses-permission android:name="android.permission.NFC" />
    <uses-feature android:name="android.hardware.nfc" android:required="false" />
    
    <!-- Camera for Logo Upload -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    
    <!-- Storage -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="32" />
    
    <!-- Vibration for haptic feedback -->
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <application
        android:label="BilltUp"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme">
        <!-- Your activities -->
    </application>
</manifest>
```

### Update build.gradle

Open: **android/app/build.gradle**

Set minimum SDK to 24:

```gradle
android {
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 33
    }
}
```

---

## iOS Configuration (Mac Only)

### Update Info.plist

Open: **ios/App/App/Info.plist**

Add these keys:

```xml
<key>NSCameraUsageDescription</key>
<string>BilltUp needs camera access to upload business logos and capture signatures.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>BilltUp needs photo access to upload business logos.</string>

<key>NFCReaderUsageDescription</key>
<string>BilltUp needs NFC access to process contactless payments.</string>
```

### Add NFC Capability in Xcode

1. Select project → App target
2. Go to "Signing & Capabilities"
3. Click "+ Capability"
4. Add "Near Field Communication Tag Reading"

---

## Testing on Device

### Android

```bash
# List connected devices
adb devices

# Run on device
npx cap run android --target YOUR_DEVICE_ID
```

Or use the "Run" button in Android Studio.

### iOS

```bash
# List devices
xcrun simctl list devices

# Run on device
npx cap run ios --target YOUR_DEVICE_ID
```

Or use the "Run" button in Xcode.

---

## Building for App Stores

### Android Release Build

**1. Generate Release Keystore (first time only):**

```bash
cd android
keytool -genkey -v -keystore billtup-release.keystore \
  -alias billtup -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# - Password (remember this!)
# - Your name/organization info
```

**2. Configure Signing:**

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=billtup
storeFile=../billtup-release.keystore
```

Update `android/app/build.gradle`:

```gradle
// Add before 'android {' block
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**3. Build Release AAB (for Play Store):**

```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

### iOS Release Build (Mac Only)

**1. Set Up Apple Developer Account:**
- Sign up at [developer.apple.com](https://developer.apple.com) ($99/year)
- Create App ID: `com.billtup.app`
- Create provisioning profiles

**2. Configure in Xcode:**
1. Open: `npx cap open ios`
2. Select project → App target
3. Go to "Signing & Capabilities"
4. Select your team
5. Ensure Bundle Identifier is `com.billtup.app`

**3. Archive and Upload:**
1. In Xcode menu: Product → Archive
2. Wait for archive to complete
3. Click "Distribute App"
4. Select "App Store Connect"
5. Follow wizard to upload

---

## App Store Submission

### Google Play Store ($25 one-time)

1. Create Google Play Console account
2. Create new app
3. Upload AAB file
4. Fill out store listing:
   - Title: BilltUp
   - Short description: "Modern invoicing for service businesses"
   - Screenshots: 2-5 screenshots
   - App icon: 512x512 PNG
   - Feature graphic: 1024x500 PNG
5. Complete content rating questionnaire
6. Set pricing (Free or Paid)
7. Submit for review

### Apple App Store ($99/year)

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Select your app
3. Fill out app information:
   - Name: BilltUp
   - Subtitle: "Invoice & Get Paid"
   - Keywords: invoice, billing, payment, business
   - Screenshots: 5-10 screenshots
   - App icon: 1024x1024 PNG
4. Set pricing
5. Submit for review

---

## App Description Template

```
BilltUp - Modern Invoicing for Service Businesses

Create professional invoices, accept payments, and get paid faster with BilltUp.

🚀 KEY FEATURES:
• Create beautiful, professional invoices in seconds
• Accept contactless card payments with NFC
• Stripe integration for secure payment processing
• Automatic email receipts to customers
• Track payments and revenue with analytics
• Manage customers and invoice history
• Upload your business logo
• Dark mode support

💳 SECURE PAYMENTS:
• Bank-level encryption
• PCI compliant via Stripe
• No card data stored on our servers
• 3.5% + $0.50 per transaction

📊 PERFECT FOR:
• Service providers
• Freelancers
• Small businesses
• Contractors
• Consultants

Start invoicing smarter today with BilltUp!

PRICING:
• Free to sign up
• 3.5% + $0.50 per transaction
• No monthly fees

SUPPORT:
Email: support@billtup.com
Website: billtup.com
```

---

## Updating Your App

### Making Changes

```bash
# 1. Update your web code
npm run build

# 2. Sync to native projects
npx cap sync

# 3. Increment version numbers
# Android: android/app/build.gradle
#   versionCode 2
#   versionName "1.0.1"
# iOS: Xcode → General → Version & Build

# 4. Build release
cd android && ./gradlew bundleRelease
# or Archive in Xcode

# 5. Upload to stores (takes 1-3 days for review)
```

---

## Troubleshooting

### White Screen on App Launch

```bash
# Solution:
npm run build
npx cap sync
# Check browser DevTools in Android Studio/Xcode
```

### NFC Not Working

```bash
# Solution:
# - Check NFC is enabled on device
# - Verify permissions in AndroidManifest.xml
# - Test on physical device (not emulator)
```

### App Rejected from Store

Common reasons:
- Missing privacy policy
- Incomplete app information
- Crashes on launch
- Violates store policies
- Missing required screenshots

Solution: Read rejection email carefully and address all issues

---

## Cost Summary

### Mobile Apps
- **Google Play Store**: $25 one-time
- **Apple Developer Program**: $99/year
- **Both platforms**: $124 first year, $99/year after

---

## Next Steps

1. ✅ Install Capacitor and plugins
2. ✅ Test mobile build on emulator
3. ✅ Test on real Android device with NFC
4. ✅ Polish mobile UI
5. ✅ Create app icons and screenshots
6. ✅ Submit to app stores
7. ✅ Wait for approval (1-3 days)

---

**Last Updated:** November 11, 2025  
**Setup Time:** 30 minutes  
**Difficulty:** Medium
