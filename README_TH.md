# Memo Generator WebApp - Supabase Global Login

เวอร์ชันนี้ปรับให้ระบบ Login / Controller Setup โหลดข้อมูลผู้ใช้จาก Supabase ก่อนแสดงหน้า Login
เพื่อให้ตั้งรหัสผ่าน Controller `Udompol.k` เพียงครั้งเดียว แล้วสามารถ Login ได้จากเครื่องอื่นได้

## ไฟล์ที่ใช้ Upload ขึ้น GitHub Pages

- `index.html`

## Supabase Project

- URL: `https://gliblypqfaqhugxpyxze.supabase.co`
- Table หลัก: `public.app_kv_store`

## วิธีใช้งาน

1. Run `supabase_schema.sql` ใน Supabase SQL Editor ให้เรียบร้อยก่อน
2. Upload `index.html` ขึ้น GitHub Pages
3. เปิด Webapp เครื่องแรก แล้วตั้ง Controller Password ของ `Udompol.k`
4. รอข้อความ Supabase Sync สำเร็จ หรือรอประมาณ 3-5 วินาที
5. เปิดเครื่องอื่น / Browser อื่น แล้วเข้าลิงก์เดียวกัน
6. ระบบจะโหลด `memo_auth_users_v1` จาก Supabase ก่อน จึงไม่ควรขึ้น Controller Setup ซ้ำ

## ถ้ายังขึ้น Controller Setup ซ้ำ

ตรวจใน Supabase > Table Editor > `app_kv_store` ต้องมี key:

- `memo_auth_users_v1`

และ value ต้องมี user `Udompol.k` พร้อม `hash` และ `salt`

