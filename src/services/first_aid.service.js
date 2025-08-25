// First Aid Service
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
import { FirstAid } from '../models/first_aid.model.js';

class FirstAidService {
  constructor() {
    this.collectionName = 'first_aid';
  }

  // ดึงข้อมูลทั้งหมด
  async getAll() {
    console.log('🔄 กำลังดึงข้อมูลการปฐมพยาบาล...');
    try {
      const q = query(collection(db, this.collectionName), orderBy('title'));
      const querySnapshot = await getDocs(q);
      const firstAids = [];
      
      querySnapshot.forEach((doc) => {
        firstAids.push(FirstAid.fromFirestore(doc));
      });
      
      console.log('📊 ดึงข้อมูลการปฐมพยาบาลสำเร็จ:', firstAids.length, 'รายการ');
      return firstAids;
    } catch (error) {
      console.error('❌ ดึงข้อมูลการปฐมพยาบาลล้มเหลว:', error);
      throw error;
    }
  }

  // ดึงข้อมูลตาม ID
  async getById(id) {
    console.log('🔄 กำลังดึงข้อมูลการปฐมพยาบาล ID:', id);
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const firstAid = FirstAid.fromFirestore(docSnap);
        console.log('✅ ดึงข้อมูลการปฐมพยาบาลสำเร็จ:', firstAid);
        return firstAid;
      } else {
        throw new Error('ไม่พบข้อมูล');
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลการปฐมพยาบาลล้มเหลว:', error);
      throw error;
    }
  }

  // เพิ่มข้อมูลใหม่
  async create(firstAidData) {
    console.log('🔄 กำลังเพิ่มการปฐมพยาบาลใหม่...', firstAidData);
    try {
      const firstAid = new FirstAid(firstAidData);
      const errors = firstAid.validate();
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const docRef = await addDoc(collection(db, this.collectionName), firstAid.toFirestore());
      console.log('✅ เพิ่มการปฐมพยาบาลสำเร็จ ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ เพิ่มการปฐมพยาบาลล้มเหลว:', error);
      throw error;
    }
  }

  // อัปเดตข้อมูล
  async update(id, firstAidData) {
    console.log('🔄 กำลังอัปเดตการปฐมพยาบาล ID:', id, firstAidData);
    try {
      const firstAid = new FirstAid(firstAidData);
      const errors = firstAid.validate();
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, firstAid.toFirestore());
      console.log('✅ อัปเดตการปฐมพยาบาลสำเร็จ');
      return true;
    } catch (error) {
      console.error('❌ อัปเดตการปฐมพยาบาลล้มเหลว:', error);
      throw error;
    }
  }

  // ลบข้อมูล
  async delete(id) {
    console.log('🔄 กำลังลบการปฐมพยาบาล ID:', id);
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('✅ ลบการปฐมพยาบาลสำเร็จ');
      return true;
    } catch (error) {
      console.error('❌ ลบการปฐมพยาบาลล้มเหลว:', error);
      throw error;
    }
  }
}

export default new FirstAidService();