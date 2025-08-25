// First Aid Model
export class FirstAid {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
  }

  // แปลงเป็น object สำหรับ Firestore
  toFirestore() {
    return {
      title: this.title,
      description: this.description
    };
  }

  // สร้าง FirstAid จาก Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new FirstAid({
      id: doc.id,
      ...data
    });
  }

  // Validation
  validate() {
    const errors = [];
    if (!this.title.trim()) errors.push('หัวข้อห้ามว่าง');
    if (!this.description.trim()) errors.push('รายละเอียดห้ามว่าง');
    return errors;
  }
}