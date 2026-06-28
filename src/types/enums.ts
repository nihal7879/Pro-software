/** Domain enumerations for the procurement system. */

export enum UserRole {
  Purchase = 'PURCHASE',
  HOD = 'HOD',
  CEO = 'CEO',
}

export enum ApprovalStatus {
  Draft = 'DRAFT',
  Pending = 'PENDING',
  HodApproved = 'HOD_APPROVED',
  CeoApproved = 'CEO_APPROVED',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
}

export enum DocumentStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  OnHold = 'ON_HOLD',
}

export enum VendorStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Blacklisted = 'BLACKLISTED',
  Pending = 'PENDING',
}

export enum ChargeableFlag {
  Chargeable = 'CHARGEABLE',
  NonChargeable = 'NON_CHARGEABLE',
  ChargesInPackage = 'CHARGES_IN_PACKAGE',
}

export enum PriorityLevel {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Urgent = 'URGENT',
}

export enum NotificationType {
  Approval = 'APPROVAL',
  Rejection = 'REJECTION',
  Info = 'INFO',
  Warning = 'WARNING',
  Mention = 'MENTION',
}

export enum SpendCategory {
  Consumables = 'CONSUMABLES',
  Equipment = 'EQUIPMENT',
  Pharmacy = 'PHARMACY',
  Surgical = 'SURGICAL',
  Laboratory = 'LABORATORY',
  GeneralStore = 'GENERAL_STORE',
  Kitchen = 'KITCHEN',
  Maintenance = 'MAINTENANCE',
}
