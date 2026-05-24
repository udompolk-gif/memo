# Memo Generator — Azure Static Web Apps + Microsoft Entra ID Ready

ชุดไฟล์นี้ปรับจาก HTML เดิมให้พร้อมนำขึ้น Azure Static Web Apps โดยใช้ Microsoft Entra ID เป็น Login กลางองค์กร และมี Azure Functions API สำหรับควบคุมสมาชิกผ่าน Azure Table Storage

## โครงสร้างไฟล์

```text
app/
  index.html                     # หน้าเว็บ Memo Generator ที่ปรับ Azure SSO แล้ว
  staticwebapp.config.json        # บังคับ authenticated ทุกหน้า + route /.auth/login/aad
api/
  me/                             # API อ่าน client principal จาก x-ms-client-principal
  users/status/                   # ตรวจสถานะสมาชิก / auto create pending user
  users/list/                     # Controller ดูสมาชิกทั้งหมด
  users/update/                   # Controller อนุมัติ/ปฏิเสธ/ปิดใช้งาน
  shared/                         # helper parse Entra principal และ Azure Table Storage
.github/workflows/
  azure-static-web-apps.yml.template
```

## App Settings ที่ต้องตั้งใน Azure Static Web Apps

```text
MEMO_STORAGE_CONNECTION_STRING=<Azure Storage Account connection string>
MEMO_USERS_TABLE=MemoUsers
CONTROLLER_EMAILS=udompol.k@yourcompany.com
CONTROLLER_USERNAMES=Udompol.k
ALLOWED_EMAIL_DOMAINS=yourcompany.com
```

> ให้เปลี่ยน `udompol.k@yourcompany.com` และ `yourcompany.com` เป็นข้อมูลจริงขององค์กร

## Flow การใช้งาน

1. User เข้า URL ของ Azure Static Web Apps
2. `staticwebapp.config.json` บังคับ Login ด้วย `/.auth/login/aad`
3. หน้าเว็บเรียก `/.auth/me` เพื่ออ่าน Microsoft Entra ID principal
4. หน้าเว็บเรียก `/api/users/status`
5. ถ้าเป็น Controller (`Udompol.k`) จะเป็น `active/controller`
6. User ทั่วไปที่ยังไม่เคยเข้า จะถูกสร้างเป็น `pending/member`
7. Controller เข้าเมนู Members เพื่อ Approve / Reject / Disable

## หมายเหตุสำคัญ

- ไฟล์นี้ยังคง Local Login เดิมไว้เป็น fallback เมื่อเปิดเป็นไฟล์ HTML บนเครื่องหรือทดสอบแบบไม่มี Azure Auth
- เมื่อ Deploy จริงบน Azure Static Web Apps ให้ใช้ Microsoft Entra ID เป็นตัวหลัก
- Memo data ใน HTML เดิมยังมีส่วนที่ใช้ Local Storage อยู่ หากต้องการ Production เต็มรูปแบบ ควรย้าย MemoHeaders/MemoItems ไป API + Database กลางด้วย
