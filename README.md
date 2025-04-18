# 🛒 Webshop Projekt – Információs Rendszerek

Ez a repository az **Információs rendszerek** című egyetemi kurzus keretében készült. A cél egy teljeskörű webshop rendszer megvalósítása volt **Angular frontenddel** és **Node.js backenddel**, admin és user jogosultságkezeléssel.

---

## 🧩 Technológiák

**Frontend:**
- Angular
- TypeScript
- HTML & CSS
- Bootstrap

**Backend:**
- Node.js
- Express
- REST API

---

## 🎯 Funkcionalitások

- 🔐 **Admin / User jogosultságkezelés**
  - Adminként új termékek felvitele, meglévők szerkesztése, rendelésfigyelés
  - Userként böngészés, kosár használata, rendelés leadása

- 🛍️ **Kosár és rendeléskezelés**
  - Termékek kosárba helyezése, mennyiség módosítása
  - Rendelés leadása és visszaigazolása

- ⏱️ **Kiszállítás becslés**
  - Backend logika számítja ki a szállítási időt, figyelembe véve az aktuálisan szabad "sütőket"

---

## 📦 Backend sajátosságok

- Dinamikus sütőkapacitás-kezelés
- RESTful API végpontok a rendelés, termék, felhasználó és admin funkciókhoz
- Adatbázis (pl. MongoDB / JSON fájlok) a rendelések és felhasználók tárolására

---

## ▶️ Futtatás

### Backend
```bash
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
ng serve

A frontend ezután elérhető lesz a http://localhost:4200 címen.
