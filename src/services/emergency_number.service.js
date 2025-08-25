// Emergency Numbers Service
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase.config.js';
import { EmergencyNumber } from '../models/emergency_number.model.js';

class EmergencyNumberService {
  constructor() {
    this.collectionName = 'emergency_numbers';
  }

  // ดึงข้อมูลทั้งหมด
  async getAll() {
    console.log('🔄 กำลังดึงข้อมูลเบอร์ฉุกเฉิน...');
    try {
      const q = query(collection(db, this.collectionName), orderBy('name'));
      const querySnapshot = await getDocs(q);
      const emergencyNumbers = [];
      
      querySnapshot.forEach((doc) => {
        emergencyNumbers.push(EmergencyNumber.fromFirestore(doc));
      });
      
      console.log('📊 ดึงข้อมูลเบอร์ฉุกเฉินสำเร็จ:', emergencyNumbers.length, 'รายการ');
      return emergencyNumbers;
    } catch (error) {
      console.error('❌ ดึงข้อมูลเบอร์ฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงข้อมูลตาม ID
  async getById(id) {
    console.log('🔄 กำลังดึงข้อมูลเบอร์ฉุกเฉิน ID:', id);
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const emergencyNumber = EmergencyNumber.fromFirestore(docSnap);
        console.log('✅ ดึงข้อมูลเบอร์ฉุกเฉินสำเร็จ:', emergencyNumber);
        return emergencyNumber;
      } else {
        throw new Error('ไม่พบข้อมูล');
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลเบอร์ฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // เพิ่มข้อมูลใหม่
  async create(emergencyNumberData) {
    console.log('🔄 กำลังเพิ่มเบอร์ฉุกเฉินใหม่...', emergencyNumberData);
    try {
      const emergencyNumber = new EmergencyNumber(emergencyNumberData);
      const errors = emergencyNumber.validate();
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const docRef = await addDoc(collection(db, this.collectionName), emergencyNumber.toFirestore());
      console.log('✅ เพิ่มเบอร์ฉุกเฉินสำเร็จ ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ เพิ่มเบอร์ฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // อัปเดตข้อมูล
  async update(id, emergencyNumberData) {
    console.log('🔄 กำลังอัปเดตเบอร์ฉุกเฉิน ID:', id, emergencyNumberData);
    try {
      const emergencyNumber = new EmergencyNumber(emergencyNumberData);
      const errors = emergencyNumber.validate();
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, emergencyNumber.toFirestore());
      console.log('✅ อัปเดตเบอร์ฉุกเฉินสำเร็จ');
      return true;
    } catch (error) {
      console.error('❌ อัปเดตเบอร์ฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // ลบข้อมูล
  async delete(id) {
    console.log('🔄 กำลังลบเบอร์ฉุกเฉิน ID:', id);
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('✅ ลบเบอร์ฉุกเฉินสำเร็จ');
      return true;
    } catch (error) {
      console.error('❌ ลบเบอร์ฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }
}

export default new EmergencyNumberService();