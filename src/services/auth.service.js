// Authentication Service
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config.js';

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  // เข้าสู่ระบบ
  async login(email, password) {
    console.log('🔄 เริ่มการเข้าสู่ระบบ...', email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('👤 User authenticated:', user.uid);
      
      // ตรวจสอบ role ใน Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('📊 ข้อมูลผู้ใช้:', userData);
        
        if (userData.role === 'admin' || userData.role === 'super_admin') {
          console.log('✅ เข้าสู่ระบบสำเร็จ - Admin');
          this.currentUser = { ...user, role: userData.role };
          return { user, role: userData.role };
        } else {
          await signOut(auth);
          throw new Error('ไม่มีสิทธิ์เข้าใช้งานระบบ Admin');
        }
      } else {
        // สำหรับ admin@sos.com ให้สิทธิ์ super_admin โดยอัตโนมัติ
        if (email === 'admin@sos.com') {
          console.log('✅ Admin email detected - granted super_admin');
          this.currentUser = { ...user, role: 'super_admin' };
          return { user, role: 'super_admin' };
        } else {
          await signOut(auth);
          throw new Error('ไม่พบข้อมูลผู้ใช้');
        }
      }
    } catch (error) {
      console.error('❌ การเข้าสู่ระบบล้มเหลว:', error);
      throw error;
    }
  }

  // ออกจากระบบ
  async logout() {
    console.log('🔄 กำลังออกจากระบบ...');
    try {
      await signOut(auth);
      this.currentUser = null;
      console.log('✅ ออกจากระบบสำเร็จ');
    } catch (error) {
      console.error('❌ การออกจากระบบล้มเหลว:', error);
      throw error;
    }
  }

  // ติดตามสถานะการเข้าสู่ระบบ
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ตรวจสอบ role จาก Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            this.currentUser = { ...user, role: userData.role };
            callback({ ...user, role: userData.role });
          } else if (user.email === 'admin@sos.com') {
            this.currentUser = { ...user, role: 'super_admin' };
            callback({ ...user, role: 'super_admin' });
          } else {
            this.currentUser = null;
            callback(null);
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          this.currentUser = null;
          callback(null);
        }
      } else {
        this.currentUser = null;
        callback(null);
      }
    });
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser() {
    return this.currentUser;
  }
}

export default new AuthService();