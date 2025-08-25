// User Model
export class User {
  constructor(data = {}) {
    this.userId = data.userId || '';
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.role = data.role || 'user';
    this.gender = data.gender || null;
    this.bloodType = data.bloodType || null;
    this.disease = data.disease || null;
    this.allergy = data.allergy || null;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || null;
  }

  // แปลงเป็น object สำหรับ Firestore
  toFirestore() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      role: this.role,
      gender: this.gender,
      bloodType: this.bloodType,
      disease: this.disease,
      allergy: this.allergy,
      isActive: this.isActive,
      createdAt: this.createdAt
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