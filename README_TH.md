# Memo Generator WebApp - Supabase Ready

ไฟล์นี้ถูกปรับให้พร้อมใช้กับ GitHub Pages + Supabase แล้ว

## ไฟล์หลัก
- `index.html` = ใช้ upload ขึ้น GitHub Pages
- `supabase_schema.sql` = Run ใน Supabase SQL Editor ก่อนใช้งาน

## Supabase Config ที่ใส่แล้ว
- SUPABASE_URL = `https://gliblypqfaqhugxpyxze.supabase.co`
- SUPABASE_PUBLISHABLE_KEY = `sb_publishable_KfdgqwkmrXbMeY4mZNuOaw_qVhGLOrz`

## วิธีใช้
1. เข้า Supabase > SQL Editor
2. Run ไฟล์ `supabase_schema.sql`
3. Upload `index.html` ขึ้น GitHub repo
4. เปิด GitHub Pages
5. ทดสอบ Save Memo แล้วดู table `app_kv_store`

## หมายเหตุสำคัญ
Phase 1 นี้ใช้ตารางกลาง `app_kv_store` เพื่อ sync ข้อมูลเดิมจาก localStorage ไป Supabase โดยไม่ต้องรื้อโค้ดเดิมทั้งหมด
ข้อมูลที่ sync เช่น `pro_memos`, `memo_people`, `memo_settings`, `memo_auth_users_v1`

Policy ใน SQL นี้เปิดกว้างสำหรับการทดสอบ หากใช้งาน Production ควรทำระบบ Auth/RLS ให้เข้มขึ้น
