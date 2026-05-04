# PROJECT NAME : Crowdfunding Platform (MERN Stack)


# CONTRIBUTORS:
    KAUSTUBH
    KEERTHAN 
    NAVEEN
    BHAVYA
    SHRITHA


# Project Overview

This platform is designed to simulate a real-world crowdfunding ecosystem similar to modern fintech-social applications. It supports:

* Campaign creation and management
* Secure online donations
* Admin moderation and fraud handling
* Personalized user dashboards
* Real-time campaign tracking

---

# Core Functionalities

## Authentication & Authorization

* Secure user registration and login
* JWT-based authentication
* Role-based access (User / Admin)
* Protected routes using middleware

---

##  Campaign Management

* Create, edit, and delete fundraising campaigns
* Campaign approval workflow (Admin-controlled)
* Campaign lifecycle:

  * Draft → Pending → Approved → Completed
* Media uploads and campaign categorization

---

##  Donation System

* Secure payment integration using Razorpay
* Donation tracking with transaction IDs
* Anonymous donation option
* Real-time updates to campaign funding

---

##  Notifications & Email System

* Automated email notifications via Nodemailer
* Donation confirmations
* Campaign approval/rejection alerts
* In-app notification system

---

##  Admin Panel

* Review and approve/reject campaigns
* Monitor flagged campaigns (fraud detection)
* Manage users and platform activity
* Handle refunds for scam or failed campaigns

---

## Campaign Interaction

* View campaign statistics (funds raised, donors, progress)
* Comment system for engagement
* Share and view tracking
* Trending and filtered campaigns

---

##  User Profiles

### 🔹 Campaign Creator

* Full campaign management dashboard
* Access to detailed analytics:

  * Total funds raised
  * Number of donors
  * Campaign performance

### 🔹 Donor

* Donation history
* Transaction details
* Personalized dashboard

### 🔹 Visitor (Not Donated)

* View limited campaign details
* Access only basic stats

---

#  Technical Architecture

##  Frontend

* React.js
* Component-based architecture
* Axios for API communication
* Dynamic UI rendering

---

##  Backend

* Node.js + Express.js
* RESTful API architecture
* Modular folder structure:

  * Controllers
  * Routes
  * Services
  * Middleware

---

##  Database

* MongoDB (NoSQL)
* Optimized schema design with indexing
* Collections:

  * Users
  * Campaigns
  * Donations
  * Notifications
  * Comments
  * Flags (fraud reports)

---

#  APIs Overview

##  Auth APIs

* Register / Login
* JWT token generation
* User session management

---

##  Campaign APIs

* Create, update, delete campaigns
* Fetch campaigns (filter, search, trending)
* Campaign approval workflow

---

##  Donation APIs

* Create payment order
* Verify payment
* Store transaction details

---

##  User APIs

* Profile management
* Fetch user donations & campaigns

---

##  Admin APIs

* Approve/reject campaigns
* Handle flagged campaigns
* Manage refunds

---

##  Notification APIs

* Fetch user notifications
* Mark as read

---

##  Comment APIs

* Add/delete comments
* Fetch campaign discussions

---

#  Middleware

* **Authentication Middleware**

  * Verifies JWT token

* **Authorization Middleware**

  * Restricts admin-only routes

* **Validation Middleware**

  * Ensures correct request data

* **Error Handling Middleware**

  * Centralized error responses

---

#  Payment Integration Flow

1. User initiates donation
2. Backend creates Razorpay order
3. Frontend triggers payment gateway
4. Payment verification via backend
5. Donation stored and campaign updated
6. Notification + email triggered

---

#  Failure & Refund Handling

* Detection of suspicious campaigns
* Admin-triggered refunds for:

  * Fraudulent campaigns
  * Failed campaign goals (optional logic)
* Transaction logs maintained for auditing

---

#  Design Considerations

* Scalable NoSQL schema design
* Separation of concerns (MVC pattern)
* Secure payment verification
* Real-world failure handling
* Modular and extensible architecture

---

#  Project Structure


root/
 ├── frontend/
 ├── backend/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middleware/
 │   ├── services/
 │   └── config/
 └── README.md

---

#  Future Enhancements

* Real-time updates using WebSockets
* AI-based fraud detection
* Campaign recommendation system
* Social sharing integrations
* Multi-currency support

---

#  Testing

* API testing using Postman
* Edge case handling:

  * Payment failures
  * Invalid tokens
  * Unauthorized access

---

#  Conclusion

This project demonstrates a complete full-stack implementation of a crowdfunding system with real-world features such as:

* Secure payments
* Admin moderation
* Scalable backend architecture
* User-centric design

---