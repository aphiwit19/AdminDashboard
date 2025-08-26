// Admin Model
export class Admin {
  constructor(data = {}) {
    this.adminId = data.adminId || '';
    this.email = data.email || '';
    this.role = data.role || 'admin'; // 'admin' หรือ 'super_admin'
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLoginAt = data.lastLoginAt || null;
    this.fullName = data.fullName || '';
  }

  // แปลงเป็น object สำหรับ Firestore
  toFirestore() {
    return {
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      fullName: this.fullName
    };
  }

  // สร้าง Admin จาก Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Admin({
      adminId: doc.id,
      ...data
    });
  }

  // Validation
  validate() {
    const errors = [];
    if (!this.email.trim()) errors.push('อีเมลห้ามว่าง');
    if (!this.role.trim()) errors.push('สิทธิ์การใช้งานห้ามว่าง');
    return errors;
  }
}