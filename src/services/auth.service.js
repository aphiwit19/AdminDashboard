// Authentication Service
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config.js';
import adminService from './admin.service.js';

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
      
      // ตรวจสอบใน admins collection
      const admin = await adminService.getById(user.uid);
      if (admin && admin.isActive) {
        console.log('✅ เข้าสู่ระบบสำเร็จ - Admin (from admins collection)');
        // อัพเดทเวลาเข้าสู่ระบบล่าสุด
        await adminService.updateLastLogin(user.uid);
        this.currentUser = { ...user, role: admin.role };
        return { user, role: admin.role };
      }
      
      // สำหรับ admin@sos.com ให้สิทธิ์ super_admin โดยอัตโนมัติ
      if (email === 'admin@sos.com') {
        console.log('✅ Admin email detected - granted super_admin');
        this.currentUser = { ...user, role: 'super_admin' };
        return { user, role: 'super_admin' };
      } else {
        await signOut(auth);
        throw new Error('ไม่มีสิทธิ์เข้าใช้งานระบบ Admin');
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
        // ตรวจสอบใน admins collection
        try {
          const admin = await adminService.getById(user.uid);
          if (admin && admin.isActive) {
            this.currentUser = { ...user, role: admin.role };
            callback({ ...user, role: admin.role });
            return;
          }
          
          // สำหรับ admin@sos.com
          if (user.email === 'admin@sos.com') {
            this.currentUser = { ...user, role: 'super_admin' };
            callback({ ...user, role: 'super_admin' });
            return;
          }
          
          // ไม่ใช่ admin ให้เป็น null
          this.currentUser = null;
          callback(null);
        } catch (error) {
          console.error('Error checking admin role:', error);
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