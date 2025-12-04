// مثال كود Flutter لـ Google Sign-In مع serverClientId
// أنشئ ملف جديد: lib/services/google_auth_service.dart

import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class GoogleAuthService {
  // ⚠️ مهم: استخدم نفس الـ serverClientId الموجود في السيرفر
  static const String _serverClientId = '123456789-abcdefghijklmnop.apps.googleusercontent.com';

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: _serverClientId, // للويب فقط
    serverClientId: _serverClientId, // للموبايل - نفس القيمة المهمة!
    scopes: [
      'email',
      'profile',
      'openid', // إضافة هذا مهم للحصول على idToken صحيح
    ],
  );

  // تسجيل الدخول بحساب Google
  Future<Map<String, dynamic>?> signInWithGoogle() async {
    try {
      print('🔐 بدء تسجيل الدخول بحساب Google...');

      // محاولة تسجيل الدخول الصامت أولاً
      GoogleSignInAccount? account = _googleSignIn.currentUser;

      if (account == null) {
        // إذا لم يكن مسجلاً دخول، اطلب تسجيل الدخول
        account = await _googleSignIn.signIn();
      }

      if (account == null) {
        print('❌ المستخدم ألغى تسجيل الدخول');
        return null;
      }

      print('✅ تم تسجيل الدخول بنجاح');
      print('📧 البريد الإلكتروني: ${account.email}');
      print('👤 الاسم: ${account.displayName}');

      // الحصول على Authentication details
      final GoogleSignInAuthentication? auth = await account.authentication;

      if (auth == null) {
        print('❌ فشل في الحصول على Authentication details');
        return null;
      }

      print('🔑 ID Token موجود: ${auth.idToken != null}');
      print('🔑 Access Token موجود: ${auth.accessToken != null}');

      if (auth.idToken == null) {
        print('❌ لا يوجد ID Token - تأكد من إعدادات Google Cloud Console');
        return null;
      }

      print('📏 طول ID Token: ${auth.idToken!.length} حرف');

      // إرسال التوكين للسيرفر
      return await _sendTokenToServer(auth.idToken!);

    } catch (error) {
      print('❌ خطأ في تسجيل الدخول: $error');

      // طباعة تفاصيل أكثر للمساعدة في التشخيص
      if (error.toString().contains('sign_in_failed')) {
        print('💡 نصيحة: تأكد من أن SHA-1 fingerprint صحيح في Google Cloud Console');
      }

      return null;
    }
  }

  // إرسال التوكين للسيرفر
  Future<Map<String, dynamic>?> _sendTokenToServer(String idToken) async {
    try {
      print('🚀 إرسال التوكين للسيرفر...');

      final response = await http.post(
        Uri.parse('https://your-api-domain.com/auth/google/native'), // غير هذا بعنوان السيرفر
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'idToken': idToken,
        }),
      );

      print('📡 رد السيرفر: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('✅ نجح تسجيل الدخول في السيرفر');
        return data;
      } else {
        print('❌ فشل تسجيل الدخول في السيرفر');
        print('الرد: ${response.body}');

        // تحليل رسالة الخطأ
        try {
          final errorData = jsonDecode(response.body);
          print('🔍 تفاصيل الخطأ: ${errorData['message']}');

          if (errorData.containsKey('clientIds')) {
            print('💡 Client IDs في السيرفر: ${errorData['clientIds']}');
            print('💡 تأكد من أن serverClientId في Flutter يطابق أحد هذه القيم');
          }
        } catch (e) {
          print('⚠️ لا يمكن تحليل رد الخطأ');
        }

        return null;
      }
    } catch (error) {
      print('❌ خطأ في الاتصال بالسيرفر: $error');
      return null;
    }
  }

  // تسجيل الخروج
  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      print('👋 تم تسجيل الخروج بنجاح');
    } catch (error) {
      print('❌ خطأ في تسجيل الخروج: $error');
    }
  }

  // فحص حالة تسجيل الدخول
  Stream<GoogleSignInAccount?> get authStateChanges => _googleSignIn.onCurrentUserChanged;

  // الحصول على المستخدم الحالي
  GoogleSignInAccount? get currentUser => _googleSignIn.currentUser;
}
