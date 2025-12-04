# حل مشكلة Google Authentication نهائيًا 🔐

## 1. شرح سبب الخطأ 400 "Invalid Google token"

### لماذا يحدث هذا الخطأ بالضبط؟

المشكلة في **عدم تطابق الـ Audience** في التوكين:

```
التوكين يحتوي على: "aud": "123456789-abcdefghijklmnop.apps.googleusercontent.com"
السيرفر يبحث عن:  "123456789-differentclient.apps.googleusercontent.com"
              ❌ لا يتطابقان → خطأ 400
```

### ما يحدث خطوة بخطوة:

1. **Flutter يطلب توكين من Google** مع `serverClientId`
2. **Google يصدر توكين** مع `aud` يساوي `serverClientId`
3. **Flutter يرسل التوكين** للسيرفر
4. **السيرفر يحاول التحقق** مع `GOOGLE_CLIENT_ID` مختلف
5. **فشل التحقق** بسبب عدم التطابق → خطأ 400

### لديك عدة Client IDs لأنك أنشأت عدة OAuth clients:
- كل مرة تنشئ OAuth client جديد تحصل على Client ID مختلف
- Flutter يستخدم `serverClientId` واحد منهم
- السيرفر يستخدم `GOOGLE_CLIENT_ID` مختلف

## 2. الحل النهائي للسيرفر (Node.js/Express)

### أولاً: تحديث متغيرات البيئة (.env)

```env
# أضف جميع Client IDs اللي عندك مفصولة بفواصل
GOOGLE_CLIENT_IDS=123456789-abcdefghijklmnop.apps.googleusercontent.com,987654321-differentclient.apps.googleusercontent.com,111111111-anotherclient.apps.googleusercontent.com

# أو استخدم الـ serverClientId من Flutter
GOOGLE_SERVER_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### ثانيًا: تحديث كود السيرفر

```typescript
// في AuthController.ts - استبدل دالة googleAuthNative بالكود ده:

async googleAuthNative(req: Request, res: Response) {
  try {
    const { idToken } = req.body as { idToken?: string };
    if (!idToken) {
      return res.status(400).json({ error: "idToken is required" });
    }

    // احصل على قائمة Client IDs من البيئة
    const clientIdsString = process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_SERVER_CLIENT_ID || '';
    const audiences = clientIdsString.split(',').map(id => id.trim()).filter(Boolean);

    if (audiences.length === 0) {
      console.error('❌ لا توجد Google Client IDs في متغيرات البيئة');
      return res.status(500).json({
        error: "Server configuration error",
        message: "يرجى تحديد GOOGLE_CLIENT_IDS في متغيرات البيئة"
      });
    }

    console.log('🔍 محاولة التحقق من التوكين...');
    console.log('Client IDs المحددة:', audiences);
    console.log('طول التوكين:', idToken.length);

    const googleClient = new OAuth2Client();

    // جرب التحقق مع كل Client ID
    let ticket: any = null;
    let usedClientId = '';

    for (const audience of audiences) {
      try {
        console.log(`جاري تجربة Client ID: ${audience}`);
        ticket = await googleClient.verifyIdToken({
          idToken,
          audience: audience,
        });

        usedClientId = audience;
        console.log(`✅ نجح التحقق مع Client ID: ${audience}`);
        break;

      } catch (error) {
        console.log(`❌ فشل مع ${audience}:`, (error as Error).message);
        continue;
      }
    }

    if (!ticket) {
      return res.status(400).json({
        error: "Invalid Google token",
        message: "التوكين غير صالح أو انتهت صلاحيته",
        clientIds: audiences
      });
    }

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // استخراج بيانات المستخدم
    const { email, email_verified, sub, name, given_name, family_name, picture } = payload;

    if (!email || email_verified !== true) {
      return res.status(400).json({
        error: "Email not verified by Google",
        message: "يرجى التحقق من صحة البريد الإلكتروني"
      });
    }

    console.log('✅ تم التحقق بنجاح:', { email, name, clientId: usedClientId });

    // تابع باقي منطق التطبيق...
    const tokens = await this.authService.loginWithGoogle({
      id: sub,
      email,
      displayName: name || `${given_name} ${family_name}`.trim(),
      given_name: given_name || '',
      family_name: family_name || '',
      name: name || `${given_name} ${family_name}`.trim(),
      picture: picture || '',
      locale: payload.locale || ''
    });

    return res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: tokens.userId,
      profileCompleted: false, // حسب منطق تطبيقك
      hasLocation: false
    });

  } catch (err) {
    console.error('❌ خطأ غير متوقع في Google Auth:', err);
    return res.status(500).json({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown error"
    });
  }
}
```

## 3. إعدادات Flutter الصحيحة

### في `main.dart` أو `AndroidManifest.xml`/`Info.plist`:

```dart
// Android: android/app/src/main/res/values/strings.xml
<string name="google_server_client_id">123456789-abcdefghijklmnop.apps.googleusercontent.com</string>

// iOS: ios/Runner/Info.plist
<key>GOOGLE_SERVER_CLIENT_ID</key>
<string>123456789-abcdefghijklmnop.apps.googleusercontent.com</string>
```

### في كود Flutter:

```dart
import 'package:google_sign_in/google_sign_in.dart';

class AuthService {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // نفس الـ serverClientId
    serverClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // نفس القيمة
    scopes: ['email', 'profile'],
  );

  Future<String?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();
      if (account == null) return null;

      final GoogleSignInAuthentication auth = await account.authentication;

      print('🔐 ID Token: ${auth.idToken}');
      print('طول التوكين: ${auth.idToken?.length}');

      return auth.idToken;
    } catch (error) {
      print('❌ خطأ في تسجيل الدخول: $error');
      return null;
    }
  }
}
```

## 4. خطوات توحيد Client IDs نهائيًا

### الخطوة 1: اختر Client ID واحد موحد
```bash
# اختر واحد من Client IDs الموجودين عندك، مثلاً:
UNIFIED_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
```

### الخطوة 2: حذف Client IDs الزائدة من Google Cloud Console
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. اذهب إلى "Credentials" > "OAuth 2.0 Client IDs"
3. احذف جميع الـ Client IDs عدا الـ `$UNIFIED_CLIENT_ID`

### الخطوة 3: تحديث جميع التطبيقات
```bash
# في السيرفر (.env)
echo "GOOGLE_CLIENT_ID=$UNIFIED_CLIENT_ID" >> .env
echo "GOOGLE_CLIENT_SECRET=your_client_secret" >> .env

# في Flutter (Android)
# في android/app/src/main/res/values/strings.xml
<string name="google_server_client_id">$UNIFIED_CLIENT_ID</string>

# في Flutter (iOS)
# في ios/Runner/Info.plist
<key>GOOGLE_SERVER_CLIENT_ID</key>
<string>$UNIFIED_CLIENT_ID</string>
```

### الخطوة 4: إعادة بناء التطبيقات
```bash
# Flutter
flutter clean
flutter pub get
flutter build apk --release  # أو ios

# Server
npm run build
npm restart
```

## 5. سكريبت تشخيص سريع

```javascript
// diagnose-token.js - شغله للتأكد من صحة التوكين

import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';

dotenv.config();

async function diagnoseToken(token) {
  const client = new OAuth2Client();
  const audiences = process.env.GOOGLE_CLIENT_IDS?.split(',') || [];

  console.log('🔍 تشخيص التوكين:');
  console.log('Client IDs:', audiences);

  for (const audience of audiences) {
    try {
      const ticket = await client.verifyIdToken({ idToken: token, audience });
      console.log(`✅ نجح مع ${audience}`);
      return ticket.getPayload();
    } catch (error) {
      console.log(`❌ فشل مع ${audience}: ${error.message}`);
    }
  }

  console.log('❌ فشل التحقق مع جميع Client IDs');
  return null;
}

// استخدم التوكين من Flutter logs
diagnoseToken('YOUR_TOKEN_HERE');
```

## 6. نصائح مهمة لتجنب المشكلة مستقبلًا

1. **استخدم Client ID واحد فقط** لجميع التطبيقات
2. **لا تنشئ OAuth clients جديدة** بدون داعي
3. **احتفظ بنسخة آمنة** من Client IDs في مكان آمن
4. **اختبر دائمًا** بعد أي تغيير في إعدادات Google Cloud

## 7. استكشاف الأخطاء الشائعة

### إذا استمر الخطأ:
```bash
# فحص متغيرات البيئة
echo $GOOGLE_CLIENT_IDS

# فحص التوكين من Flutter
# في Flutter logs ابحث عن: Got idToken (len=...)

# اختبار يدوي
node -e "
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();
client.verifyIdToken({
  idToken: 'التوكين هنا',
  audience: 'client_id هنا'
}).then(ticket => console.log('✅ صحيح')).catch(err => console.log('❌ خطأ:', err.message));
"
```

بهذا الحل، ستختفي مشكلة "Invalid Google token" نهائيًا! 🚀
