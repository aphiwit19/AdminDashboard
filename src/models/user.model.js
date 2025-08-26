// User Model
export class User {
  constructor(data = {}) {
    this.userId = data.userId || '';
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.gender = data.gender || null;
    this.bloodType = data.bloodType || null;
    this.disease = data.disease || null;
    this.allergy = data.allergy || null;
  }

  // แปลงเป็น object สำหรับ Firestore
  toFirestore() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      gender: this.gender,
      bloodType: this.bloodType,
      disease: this.disease,
      allergy: this.allergy
    };
  }

  // สร้าง User จาก Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      userId: doc.id,
      ...data
    });
  }
}