# Development Guidelines

คู่มือสำหรับการพัฒนาโปรเจค CCTV Monitoring Dashboard

## Code Style

### TypeScript/React
- ใช้ Functional Components และ Hooks เป็นหลัก
- ตั้งชื่อ Component ด้วย PascalCase เช่น `LiveFeed`, `EventsPanel`
- ตั้งชื่อไฟล์ให้ตรงกับชื่อ Component
- แยก Business Logic ออกจาก UI Components
- ใช้ TypeScript Types เพื่อความปลอดภัยของข้อมูล

### Styling
- ใช้ Tailwind CSS เป็นหลักในการจัด Layout และ Styling
- หลีกเลี่ยงการใช้ inline styles มากเกินไป
- ใช้ Flexbox และ Grid สำหรับ Layout
- รักษา Responsive Design ให้รองรับทุกขนาดหน้าจอ

## Component Structure

### การจัดระเบียบไฟล์
```
components/
├── ui/              # Reusable UI components (Radix UI)
├── figma/           # Custom components จาก Figma design
├── Layout.tsx       # Main layout wrapper
└── [Feature]*.tsx   # Feature-specific components
```

### Pages
แต่ละหน้าควรมีหน้าที่เฉพาะชัดเจน:
- Dashboard pages สำหรับเจ้าหน้าที่
- Citizen pages สำหรับประชาชนทั่วไป

## Data Management

### Mock Data
- ข้อมูลทดสอบเก็บไว้ใน `src/data/`
- แยกไฟล์ตามประเภทข้อมูล (cameras, events, trafficData)
- ใช้ TypeScript interface สำหรับกำหนดโครงสร้างข้อมูล

### State Management
- ใช้ React Hooks (useState, useEffect) สำหรับ local state
- พิจารณาใช้ Context API สำหรับ global state

## Routing

ใช้ React Router สำหรับจัดการเส้นทาง:
- `/dashboard/*` - สำหรับเจ้าหน้าที่
- `/citizen/*` - สำหรับประชาชน
- `/login` - หน้า Authentication

## UI/UX Principles

### Dashboard (เจ้าหน้าที่)
- เน้นการแสดงข้อมูลแบบ Real-time
- ใช้ Charts และ Graphs เพื่อความเข้าใจง่าย
- จัดวาง Layout ให้เห็นข้อมูลสำคัญได้ทันที

### Citizen Portal (ประชาชน)
- เน้นความเรียบง่ายและใช้งานง่าย
- แสดงข้อมูลที่เป็นประโยชน์กับประชาชน
- มี Interactive Map สำหรับดูตำแหน่งกล้อง

## Performance

- หลีกเลี่ยง Re-render ที่ไม่จำเป็น
- ใช้ React.memo() สำหรับ Component ที่ render บ่อย
- Lazy load images และ components เมื่อจำเป็น
- ตรวจสอบ Bundle size

## Testing (แนวทางในอนาคต)

- ควรเพิ่ม Unit Tests สำหรับ Utility Functions
- ทดสอบ Component สำคัญ
- ทดสอบ Routing และ Navigation

## Git Workflow (ถ้ามีการใช้ Version Control)

- Commit บ่อยๆ พร้อม message ที่ชัดเจน
- แยก Branch สำหรับ Feature ใหม่
- Review code ก่อน merge

## Notes

- โปรเจคนี้ยังใช้ Mock Data อยู่
- ในอนาคตควรพัฒนา Backend API
- พิจารณาเพิ่ม Authentication และ Authorization ที่สมบูรณ์
- เพิ่ม Error Handling และ Loading States

---

