// User Service
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  orderBy,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase.config.js';
import { User } from '../models/user.model.js';

class UserService {
  constructor() {
    this.collectionName = 'users';
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  async getAll() {
    console.log('🔄 กำลังดึงข้อมูลผู้ใช้ทั้งหมด...');
    try {
      const q = query(collection(db, this.collectionName), orderBy('name'));
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        try {
          const userData = doc.data();
          // ตรวจสอบและรองรับข้อมูลที่อาจไม่มีบางฟิลด์
          const user = new User({
            userId: doc.id,
            name: userData.name || '',
            phone: userData.phone || '',
            email: userData.email || '',
            role: userData.role || 'user',
            gender: userData.gender || null,
            bloodType: userData.bloodType || null,
            disease: userData.disease || null,
            allergy: userData.allergy || null,
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            createdAt: userData.createdAt || null
          });
          users.push(user);
        } catch (error) {
          console.warn('⚠️ ข้าม document ที่มีปัญหา:', doc.id, error);
        }
      });
      
      console.log('📊 ดึงข้อมูลผู้ใช้สำเร็จ:', users.length, 'คน');
      return users;
    } catch (error) {
      console.error('❌ ดึงข้อมูลผู้ใช้ล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงข้อมูลผู้ใช้ตาม ID
  async getById(userId) {
    console.log('🔄 กำลังดึงข้อมูลผู้ใช้ ID:', userId);
    try {
      const docRef = doc(db, this.collectionName, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const user = new User({
          userId: docSnap.id,
          ...userData
        });
        console.log('✅ ดึงข้อมูลผู้ใช้สำเร็จ:', user);
        return user;
      } else {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลผู้ใช้ล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงรายชื่อติดต่อของผู้ใช้
  async getUserContacts(userId) {
    console.log('🔄 กำลังดึงรายชื่อติดต่อของผู้ใช้:', userId);
    try {
      const contactsRef = collection(db, this.collectionName, userId, 'contacts');
      const q = query(contactsRef, orderBy('addedAt', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const contacts = [];
      
      querySnapshot.forEach((doc) => {
        const contactData = doc.data();
        contacts.push({
          contactId: doc.id,
          name: contactData.name || '',
          phone: contactData.phone || '',
          addedAt: contactData.addedAt || null
        });
      });
      
      console.log('📊 ดึงรายชื่อติดต่อสำเร็จ:', contacts.length, 'คน');
      return contacts;
    } catch (error) {
      console.error('❌ ดึงรายชื่อติดต่อล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงประวัติ SOS ของผู้ใช้
  async getUserSOSHistory(userId, limitCount = 10) {
    console.log('🔄 กำลังดึงประวัติ SOS ของผู้ใช้:', userId);
    try {
      const historyRef = collection(db, this.collectionName, userId, 'sos_history');
      const q = query(historyRef, orderBy('timestamp', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        const historyData = doc.data();
        history.push({
          historyId: doc.id,
          timestamp: historyData.timestamp || null,
          status: historyData.status || '',
          message: historyData.message || '',
          phoneNumbers: historyData.phoneNumbers || '',
          userName: historyData.userName || '',
          userPhone: historyData.userPhone || '',
          userGender: historyData.userGender || null,
          userBloodType: historyData.userBloodType || null,
          userDisease: historyData.userDisease || null,
          userAllergy: historyData.userAllergy || null
        });
      });
      
      console.log('📊 ดึงประวัติ SOS สำเร็จ:', history.length, 'รายการ');
      return history;
    } catch (error) {
      console.error('❌ ดึงประวัติ SOS ล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงสถิติผู้ใช้
  async getUserStats() {
    console.log('🔄 กำลังคำนวณสถิติผู้ใช้...');
    try {
      const users = await this.getAll();
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(user => user.isActive).length,
        adminUsers: users.filter(user => user.role === 'admin' || user.role === 'super_admin').length,
        regularUsers: users.filter(user => user.role === 'user').length
      };
      
      console.log('📊 สถิติผู้ใช้:', stats);
      return stats;
    } catch (error) {
      console.error('❌ คำนวณสถิติผู้ใช้ล้มเหลว:', error);
      throw error;
    }
  }
}

export default new UserService();