// Emergency Number Model
export class EmergencyNumber {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.number = data.number || '';
    this.category = data.category || '';
  }

  // แปลงเป็น object สำหรับ Firestore
  toFirestore() {
    return {
      name: this.name,
      number: this.number,
      category: this.category
    };
  }

  // สร้าง EmergencyNumber จาก Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new EmergencyNumber({
      id: doc.id,
      ...data
    });
  }

  // Validation
  validate() {
    const errors = [];
    if (!this.name.trim()) errors.push('ชื่อหน่วยงานห้ามว่าง');
    if (!this.number.trim()) errors.push('หมายเลขโทรศัพท์ห้ามว่าง');
    if (!this.category.trim()) errors.push('หมวดหมู่ห้ามว่าง');
    return errors;
  }
}