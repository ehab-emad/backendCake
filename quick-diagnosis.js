#!/usr/bin/env node

/**
 * سكريبت تشخيص سريع لمشكلة Google Authentication
 * استخدمه للتأكد من أن كل شيء محدد بشكل صحيح
 */

import { OAuth2Client } from "google-auth-library";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";

// تحميل متغيرات البيئة
dotenv.config();

console.log("🚀 تشخيص سريع لـ Google Authentication");
console.log("=====================================\n");

async function diagnose() {
  // 1. فحص متغيرات البيئة
  console.log("📋 فحص متغيرات البيئة:");
  const envVars = {
    'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
    'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
    'GOOGLE_CLIENT_IDS': process.env.GOOGLE_CLIENT_IDS,
    'GOOGLE_SERVER_CLIENT_ID': process.env.GOOGLE_SERVER_CLIENT_ID,
  };

  let configuredCount = 0;
  for (const [key, value] of Object.entries(envVars)) {
    const status = value ? '✅ محدد' : '❌ غير محدد';
    console.log(`${key}: ${status}`);
    if (value) configuredCount++;
  }

  console.log(`\nالحالة: ${configuredCount}/${Object.keys(envVars).length} متغيرات محددة\n`);

  // 2. فحص قائمة Client IDs
  const clientIdsString = process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_SERVER_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
  const audiences = clientIdsString.split(',').map(id => id.trim()).filter(Boolean);

  if (audiences.length === 0) {
    console.log("❌ لا توجد Client IDs محددة!");
    console.log("الحل: أضف GOOGLE_CLIENT_IDS في ملف .env");
    return;
  }

  console.log("🎯 Client IDs المحددة:");
  audiences.forEach((id, index) => {
    console.log(`${index + 1}. ${id}`);
  });
  console.log("");

  // 3. طلب التوكين من المستخدم للاختبار
  console.log("🔐 اختبار التوكين:");
  console.log("انسخ التوكين من Flutter logs من السطر:");
  console.log("Got idToken (len=...) [masked]=..***");
  console.log("");
  console.log("ثم شغل:");
  console.log(`node -e "
  import('google-auth-library').then(({OAuth2Client}) => {
    const client = new OAuth2Client();
    const token = 'التوكين هنا';

    Promise.all([
      ${audiences.map(id => `
      client.verifyIdToken({idToken: token, audience: '${id}'}).then(() => '${id}: ✅').catch(() => '${id}: ❌')
      `).join(',\n      ')}
    ]).then(results => {
      console.log('نتائج الاختبار:');
      results.forEach(result => console.log(result));
    });
  });
  "`);
}

diagnose().catch(console.error);
