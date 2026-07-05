# Security Specification: Technical Audits and Consultations

This document outlines the security invariants, attack vectors, and rules governing the Firebase Firestore database for the Sovereign Portfolio and Consulting Hub of Eng. Ibrahim Al-Muharqi.

## 1. Data Invariants

1. **Anonymous Submission (Create)**: Any visitor can submit a consulting inquiry or technical audit request. They do not need to be authenticated, but the input must pass strict schema validation (type, size, formatting) to prevent "Denial of Wallet" and injection attacks.
2. **PII Protection (Read)**: Submitted inquiries contain private personal information (name, email, message). Visitors must never be able to read other visitors' submissions.
3. **Admin Exclusivity (Read/Update/Delete)**: Only the verified admin (Google authenticated with email `abwkreemiprahem@gmail.com`) can read, update (e.g. mark status as completed), or delete submissions.
4. **Immutability (Identity & Integrity)**: Submitted data (name, email, message, createdAt) must be immutable once written. Only the state fields (e.g. `status`) can be updated.
5. **Temporal Integrity**: The `createdAt` timestamp must match the server time (`request.time`) exactly during creation.

---

## 2. The "Dirty Dozen" Payloads (Attack Vectors)

The following payloads attempt to violate security boundaries and must be blocked by the Firestore Rules:

1. **Unverified Admin Read**: An unauthenticated user attempts to list all technical audits. (Result: `PERMISSION_DENIED`)
2. **Spoofed Admin Email**: A user authenticates with an unverified email `abwkreemiprahem@gmail.com` (verified is false) to read data. (Result: `PERMISSION_DENIED`)
3. **Other User Profile Read**: An authenticated user with email `hacker@evil.com` attempts to read an audit written by another user. (Result: `PERMISSION_DENIED`)
4. **Id Poisoning**: An attacker tries to write an audit using a huge/malicious document ID like `../../poison/junk`. (Result: `PERMISSION_DENIED`)
5. **Malicious Role Update**: An attacker attempts to write an extra field `isAdmin: true` inside their document. (Result: `PERMISSION_DENIED`)
6. **Future / Past Timestamp Spoofing**: An attacker attempts to submit a document with `createdAt` set to a future year (e.g., `2035-01-01`). (Result: `PERMISSION_DENIED`)
7. **Bypassing Message Size Limit**: An attacker attempts to flood the database with a 2MB message string. (Result: `PERMISSION_DENIED`)
8. **Invalid Email Format**: An attacker submits a request where the email is not formatted correctly or is not a string. (Result: `PERMISSION_DENIED`)
9. **Status Escaped state**: A visitor tries to create an audit with status `completed` directly. (Result: `PERMISSION_DENIED`)
10. **State Shortcutting**: An attacker tries to update the status to a non-existent state like `approved-by-hacker`. (Result: `PERMISSION_DENIED`)
11. **Altering Immutable Fields**: A user attempts to change the applicant name of an existing submission. (Result: `PERMISSION_DENIED`)
12. **Malicious Batch Injection**: An attacker attempts to write a batch of documents lacking required fields. (Result: `PERMISSION_DENIED`)

---

## 3. Test Runner Simulation

All tests are verified against the defined rules to guarantee strict rejection of any malicious actions while allowing verified creation of contact submissions and full read/write management for Eng. Ibrahim Al-Muharqi (`abwkreemiprahem@gmail.com`).
