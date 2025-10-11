# 🕵️‍♂️ IncognitoTalk

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat&logo=mongodb)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-orange?style=flat&logo=auth0)
![Resend](https://img.shields.io/badge/Email-Resend-red?style=flat&logo=gmail)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

IncognitoTalk is a **Next.js 15** and **TypeScript-based** web app that allows users to **send and receive anonymous messages** securely. It features **email verification using Resend**, a **dashboard interface**, and complete authentication with **NextAuth.js**.

---

## 🚀 Features

✅ **Anonymous Messaging** – Send and receive secret messages without revealing your identity.  
✅ **NextAuth Authentication** – Secure login and signup using email credentials.  
✅ **Resend Email Verification** – Send OTP/verification codes using the Resend email API.  
✅ **MongoDB Database** – Stores user data, messages, and verification details.  
✅ **Modern UI** – Built with Tailwind CSS and fully responsive.  
✅ **Protected Dashboard** – Accessible only to authenticated users.  
✅ **Server-side Rendering (SSR)** for optimal performance.  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Next.js 15** | React framework for SSR and routing |
| **TypeScript** | Type safety and maintainable code |
| **NextAuth.js** | Authentication and session management |
| **MongoDB Atlas** | Cloud database for users and messages |
| **Resend** | Email delivery service for OTP verification |
| **Tailwind CSS** | Styling and responsive design |
| **bcrypt.js** | Password hashing for secure storage |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add:

```env
MONGO_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
DOMAIN=http://localhost:3000
```

---

## 🧑‍💻 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Husamuddin-tech/IncognitoTalk.git
   cd IncognitoTalk
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   - Add all credentials (MongoDB, Resend, etc.) to `.env.local`

4. **Run the App**
   ```bash
   npm run dev
   ```
   Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 📧 Email Verification with Resend

IncognitoTalk integrates **Resend** to handle all outgoing verification emails.  
When a new user signs up, an OTP or verification link is sent via **Resend’s API** to confirm the email address before account creation.

> **Resend** is a modern email service for developers — simple, fast, and API-first.

Learn more at [https://resend.com](https://resend.com).

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── (auth)/           # Login, Sign-up pages
│   ├── (app)/dashboard/  # User dashboard
│   └── api/              # API routes (messages, auth, etc.)
├── components/           # Reusable UI components
├── lib/                  # DB, NextAuth, and helper configs
├── model/                # Mongoose models
└── styles/               # Tailwind and global styles
```

---

## 🔐 Authentication Flow

1. User signs up → verification email sent via **Resend**.  
2. Once verified → credentials are stored securely in MongoDB.  
3. User logs in → session managed via **NextAuth.js**.  
4. Dashboard becomes accessible for sending/receiving messages.

---

## 📤 Deployment

You can deploy this app easily on **Vercel**:

```bash
vercel deploy
```

Make sure to add the same environment variables in your Vercel project settings.

---

## 🧩 Future Enhancements

- [ ] Real-time messaging using WebSockets or Pusher.  
- [ ] Message expiration feature.  
- [ ] Custom themes for UI personalization.  
- [ ] Enhanced analytics for user engagement.  

---

## 🧠 Author

👤 **Syed Husamuddin**  
📧 [techmubbu@gmail.com](mailto:techmubbu@gmail.com)  
🔗 [GitHub Profile](https://github.com/Husamuddin-tech)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use and modify it.

---

⭐ **If you like this project, please give it a star!** ⭐
