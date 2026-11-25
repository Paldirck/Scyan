# ScienceQuest Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Identity Ownership:** `/users/{userId}`, `/userProgress/{userId}`, `/leaderboard/{userId}`, and `/payments/{paymentId}` must strictly have `uid == request.auth.uid`.
2. **PII Isolation:** Account email addresses live exclusively inside `/users/{userId}` and are readable only by the owner (`isOwner(userId)`). `/leaderboard/{userId}` contains zero PII.
3. **Immutable Fields:** `uid`, `createdAt`, `paymentId`, `planId`, `amountIdr`, `method`, and `qrPayload` cannot be modified after creation.
4. **Server Timestamps:** `createdAt` on create and `updatedAt` on create/update must equal `request.time`.
5. **Terminal Payment State Locking:** `/payments/{paymentId}` starts as `'pending'` and may only transition once to `'paid'` or `'cancelled'`. Once `'paid'` or `'cancelled'`, no further updates are permitted.
6. **Atomic Premium Activation:** `/userProgress/{userId}` may only set `isPremium: true` when atomically referencing a `paid` `/payments/{paymentId}` owned by the same user (`getAfter(...)`).
7. **No Ghost Fields:** Every `create` uses `hasAll()` + `hasOnly()`, and every `update` uses `affectedKeys().hasOnly(...)` inside an action branch.

## 2. The "Dirty Dozen" Attack Payloads (All Must Return PERMISSION_DENIED)
1. **Unauthenticated Read:** Anonymous client calls `get(/users/alice)` -> Denied.
2. **Unauthenticated Payment:** Anonymous client calls `set(/payments/pay_1, ...)` -> Denied.
3. **Cross-User Profile Spoof:** Authenticated `bob` creates `/users/alice` with `uid: "bob"` -> Denied.
4. **Cross-User Payment Hijack:** Authenticated `bob` updates `/payments/alice_pay` -> Denied.
5. **PII Snooping:** Authenticated `bob` calls `get(/users/alice)` -> Denied.
6. **Blanket User Listing:** Authenticated `bob` calls `list(/users)` -> Denied.
7. **Shadow Field Injection:** Authenticated `alice` creates `/userProgress/alice` with extra `isAdmin: true` -> Denied.
8. **Direct Premium Spoof:** Authenticated `alice` updates `/userProgress/alice` setting `isPremium: true` without an atomic `'paid'` payment doc -> Denied.
9. **Payment Amount Tampering:** Authenticated `alice` creates `/payments/pay_1` with `amountIdr: 0` or `status: 'paid'` directly on create -> Denied.
10. **Terminal Payment Reversal:** Authenticated `alice` updates `/payments/pay_1` from `'paid'` back to `'pending'` -> Denied.
11. **Array Type/Size Poisoning:** Authenticated `alice` writes `/userProgress/alice` with `materiSelesai: [123]` -> Denied.
12. **Score Overflow / Negative XP:** Authenticated `alice` writes `/leaderboard/alice` with `totalPoin: -50` -> Denied.
