// Emergency Number Model
export class EmergencyNumber {
  constructor(data = {}) {
    this.id = data.id || '';
    // Normalize types and trim
    this.name = (data.name ?? '').toString().trim();
    this.number = (data.number ?? '').toString().trim();
    this.category = (data.category ?? '').toString().trim();
  }

  // แปลงเป็น object สำหรับ Firestore
  toFirestore() {
    return {
      name: this.name,
      number: this.number,
      category: this.category,
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
    if (!this.name) errors.push('ชื่อหน่วยงานห้ามว่าง');
    if (!this.number) errors.push('หมายเลขโทรศัพท์ห้ามว่าง');
    if (!this.category) errors.push('หมวดหมู่ห้ามว่าง');
    return errors;
  }
}