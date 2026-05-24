# Memo Generator WebApp - Supabase Ready (No Email Check Menu)

ไฟล์ชุดนี้ตัดเมนู **Email Check / การเช็คเมล์** ออกจากระบบแล้ว

## ไฟล์ที่ใช้ Deploy
- `index.html` = ใช้ Upload ขึ้น GitHub Pages
- `supabase_schema.sql` = Run ใน Supabase SQL Editor ก่อนใช้งานครั้งแรก

## สิ่งที่ตัดออก
- Tab เมนู `Email Check` บนแถบเมนูหลัก
- หน้า `view-email` ทั้งหมด
- คอลัมน์ Email Check / Email Sent / Email Reply / Email Checked At ใน Memo List
- Key สำหรับ email sync ออกจาก Supabase sync list

## สิ่งที่ยังคงอยู่
- Login / Register / Member Approval โดย Controller `Udompol.k`
- Memo Generator
- Memo List
- People Master
- Data Backup
- Members
- Settings
- Supabase Cloud Sync ผ่าน table `app_kv_store`

## ขั้นตอนใช้งาน
1. Run `supabase_schema.sql` ใน Supabase SQL Editor
2. Upload `index.html` ขึ้น GitHub Pages
3. เปิด WebApp และทดสอบ Login / Save Memo
4. ตรวจข้อมูลใน Supabase table `app_kv_store`
