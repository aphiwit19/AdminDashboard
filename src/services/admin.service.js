// Admin Service
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.config.js';
import { Admin } from '../models/admin.model.js';

class AdminService {
  constructor() {
    this.collectionName = 'admins';
  }

  // ดึงข้อมูล admin ทั้งหมด
  async getAll() {
    console.log('🔄 กำลังดึงข้อมูลผู้ดูแลระบบทั้งหมด...');
    try {
      const q = query(collection(db, this.collectionName), orderBy('email'));
      const querySnapshot = await getDocs(q);
      const admins = [];
      
      querySnapshot.forEach((doc) => {
        try {
          admins.push(Admin.fromFirestore(doc));
        } catch (error) {
          console.warn('⚠️ ข้าม document ที่มีปัญหา:', doc.id, error);
        }
      });
      
      console.log('📊 ดึงข้อมูลผู้ดูแลระบบสำเร็จ:', admins.length, 'คน');
      return admins;
    } catch (error) {
      console.error('❌ ดึงข้อมูลผู้ดูแลระบบล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงข้อมูล admin ตาม ID
  async getById(adminId) {
    console.log('🔄 กำลังดึงข้อมูลผู้ดูแลระบบ ID:', adminId);
    try {
      const docRef = doc(db, this.collectionName, adminId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const admin = Admin.fromFirestore(docSnap);
        console.log('✅ ดึงข้อมูลผู้ดูแลระบบสำเร็จ:', admin);
        return admin;
      } else {
        console.log('⚠️ ไม่พบข้อมูลผู้ดูแลระบบ');
        return null;
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลผู้ดูแลระบบล้มเหลว:', error);
      throw error;
    }
  }

  // สร้างหรืออัพเดทข้อมูล admin
  async createOrUpdate(adminId, data) {
    console.log('🔄 กำลังบันทึกข้อมูลผู้ดูแลระบบ:', adminId);
    try {
      const admin = new Admin({
        adminId,
        ...data,
        lastLoginAt: data.lastLoginAt || serverTimestamp()
      });
      
      const docRef = doc(db, this.collectionName, adminId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, admin.toFirestore());
        console.log('✅ อัพเดทข้อมูลผู้ดูแลระบบสำเร็จ');
      } else {
        await setDoc(docRef, admin.toFirestore());
        console.log('✅ สร้างข้อมูลผู้ดูแลระบบสำเร็จ');
      }
      
      return admin;
    } catch (error) {
      console.error('❌ บันทึกข้อมูลผู้ดูแลระบบล้มเหลว:', error);
      throw error;
    }
  }

  // อัพเดท lastLoginAt
  async updateLastLogin(adminId) {
    console.log('🔄 กำลังอัพเดทเวลาเข้าสู่ระบบล่าสุด:', adminId);
    try {
      const docRef = doc(db, this.collectionName, adminId);
      await updateDoc(docRef, {
        lastLoginAt: serverTimestamp()
      });
      console.log('✅ อัพเดทเวลาเข้าสู่ระบบสำเร็จ');
    } catch (error) {
      console.error('❌ อัพเดทเวลาเข้าสู่ระบบล้มเหลว:', error);
      // ไม่ throw error เพื่อให้การเข้าสู่ระบบยังทำงานได้แม้อัพเดทเวลาไม่สำเร็จ
    }
  }
}

export default new AdminService();