# คู่มือ Deploy ทีละขั้นตอน — Azure Static Web Apps + Microsoft Entra ID

## 1) เตรียมข้อมูลที่ต้องขอจาก IT

- Azure Subscription ที่องค์กรอนุญาตให้ใช้งาน
- สิทธิ์สร้าง Azure Static Web Apps
- สิทธิ์สร้าง Storage Account
- สิทธิ์ตั้งค่า Microsoft Entra ID / App Registration ถ้าต้องการ Single Tenant แบบควบคุมเข้ม
- Email จริงของ Controller: Udompol.k
- Domain email ขององค์กร เช่น company.com

## 2) สร้าง Azure Storage Account

ใช้สำหรับเก็บตารางสมาชิกกลาง `MemoUsers`

1. Azure Portal > Storage accounts > Create
2. เลือก Resource Group เดียวกับระบบ Memo
3. ตั้งชื่อ Storage Account
4. Region ให้ใกล้ผู้ใช้งาน
5. หลังสร้างเสร็จ ไปที่ Access keys
6. Copy Connection string

## 3) Upload Code ไป GitHub

1. สร้าง GitHub Repository ใหม่ เช่น `memo-generator-swa`
2. Upload โฟลเดอร์ทั้งหมดในชุดนี้ขึ้น repo
3. เปลี่ยนชื่อ `.github/workflows/azure-static-web-apps.yml.template` เป็น `.github/workflows/azure-static-web-apps.yml` หลัง Azure สร้าง deployment token หรือให้ Azure สร้าง workflow อัตโนมัติ

## 4) สร้าง Azure Static Web Apps

1. Azure Portal > Static Web Apps > Create
2. เลือก Subscription / Resource Group
3. ตั้งชื่อ เช่น `memo-generator-internal`
4. Plan: Free สำหรับทดสอบ หรือ Standard สำหรับ Production
5. Deployment source: GitHub
6. เลือก repo / branch `main`
7. Build Details:
   - App location: `app`
   - Api location: `api`
   - Output location: ว่างไว้
8. Create

## 5) ตั้งค่า Application Settings

Azure Static Web Apps > Configuration > Application settings เพิ่มค่า:

```text
MEMO_STORAGE_CONNECTION_STRING=<connection string from storage account>
MEMO_USERS_TABLE=MemoUsers
CONTROLLER_EMAILS=udompol.k@yourcompany.com
CONTROLLER_USERNAMES=Udompol.k
ALLOWED_EMAIL_DOMAINS=yourcompany.com
```

จากนั้น Save และ Restart/Trigger redeploy

## 6) ตั้งค่า Entra ID ให้ใช้เฉพาะคนในองค์กร

แบบเริ่มต้น Azure Static Web Apps มี provider สำหรับ Microsoft Entra ID ผ่าน `/.auth/login/aad` ได้อยู่แล้ว แต่สำหรับ Production ควรให้ IT ทำ App Registration แบบ Single Tenant และกำหนด redirect URI:

```text
https://<your-static-web-app-url>/.auth/login/aad/callback
```

แล้วนำ Client ID / Client Secret ไปผูกใน Authentication configuration ตามมาตรฐาน IT ขององค์กร

## 7) ทดสอบระบบ

1. เปิด URL ของ Static Web Apps
2. ระบบต้อง redirect ไป Microsoft Login
3. Login ด้วยบัญชีองค์กร
4. ถ้าเป็น Udompol.k ต้องเข้าใช้งานได้และเห็นเมนู Members
5. User อื่น Login ครั้งแรกจะขึ้น Pending
6. Udompol.k เข้า Members แล้วกด Approve
7. User กด Refresh Status หรือ Login ใหม่ แล้วเข้าใช้งานได้

## 8) ข้อควรทำก่อนใช้งานจริง

- เปลี่ยน URL เป็น custom domain เช่น `https://memo.company.com`
- จำกัด Entra ID เป็น Single Tenant
- ตรวจค่า `ALLOWED_EMAIL_DOMAINS`
- เปิด Application Insights / Log Analytics
- กำหนด Backup/Retention ของ Storage
- วางแผนย้ายข้อมูล Memo จาก Local Storage ไป Database กลาง เช่น Azure SQL / SharePoint Lists / Dataverse ใน Phase ถัดไป
