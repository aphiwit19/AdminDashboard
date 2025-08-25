// Emergency Guides Service
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
import { EmergencyGuide } from '../models/emergency_guide.model.js';

class EmergencyGuideService {
  constructor() {
    this.collectionName = 'emergency_guides';
  }

  // ดึงข้อมูลทั้งหมด
  async getAll() {
    console.log('🔄 กำลังดึงข้อมูลคู่มือฉุกเฉิน...');
    try {
      const q = query(collection(db, this.collectionName), orderBy('title'));
      const querySnapshot = await getDocs(q);
      const emergencyGuides = [];
      
      querySnapshot.forEach((doc) => {
        emergencyGuides.push(EmergencyGuide.fromFirestore(doc));
      });
      
      console.log('📊 ดึงข้อมูลคู่มือฉุกเฉินสำเร็จ:', emergencyGuides.length, 'รายการ');
      return emergencyGuides;
    } catch (error) {
      console.error('❌ ดึงข้อมูลคู่มือฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงข้อมูลตาม ID
  async getById(id) {
    console.log('🔄 กำลังดึงข้อมูลคู่มือฉุกเฉิน ID:', id);
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const emergencyGuide = EmergencyGuide.fromFirestore(docSnap);
        console.log('✅ ดึงข้อมูลคู่มือฉุกเฉินสำเร็จ:', emergencyGuide);
        return emergencyGuide;
      } else {
        throw new Error('ไม่พบข้อมูล');
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลคู่มือฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // เพิ่มข้อมูลใหม่
  async create(emergencyGuideData) {
    console.log('🔄 กำลังเพิ่มคู่มือฉุกเฉินใหม่...', emergencyGuideData);
    try {
      const emergencyGuide = new EmergencyGuide(emergencyGuideData);
      const errors = emergencyGuide.validate();
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const docRef = await addDoc(collection(db, this.collectionName), emergencyGuide.toFirestore());
      console.log('✅ เพิ่มคู่มือฉุกเฉินสำเร็จ ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ เพิ่มคู่มือฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // อัปเดตข้อมูล
  async update(id, emergencyGuideData) {
    console.log('🔄 กำลังอัปเดตคู่มือฉุกเฉิน ID:', id, emergencyGuideData);
    try {
      const emergencyGuide = new EmergencyGuide(emergencyGuideData);
      const errors = emergencyGuide.validate();
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, emergencyGuide.toFirestore());
      console.log('✅ อัปเดตคู่มือฉุกเฉินสำเร็จ');
      return true;
    } catch (error) {
      console.error('❌ อัปเดตคู่มือฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }

  // ลบข้อมูล
  async delete(id) {
    console.log('🔄 กำลังลบคู่มือฉุกเฉิน ID:', id);
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('✅ ลบคู่มือฉุกเฉินสำเร็จ');
      return true;
    } catch (error) {
      console.error('❌ ลบคู่มือฉุกเฉินล้มเหลว:', error);
      throw error;
    }
  }
}

export default new EmergencyGuideService();