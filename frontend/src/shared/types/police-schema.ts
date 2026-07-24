// src/shared/types/police-schema.ts
/**
 * Police Department Schema Types
 * Official Karnataka Police FIR System Database
 */

export interface State {
  stateId: number;
  stateName: string;
}

export interface District {
  districtId: number;
  districtName: string;
  stateId: number;
}

export interface PoliceStation {
  unitId: number;
  unitName: string;
  typeId: number;
  districtId: number;
  stateId: number;
}

export interface PoliceOfficer {
  employeeId: number;
  kgId: string; // Karnataka Government ID
  firstName: string;
  rankId: number;
  designationId: number;
  districtId: number;
  unitId: number;
}

export interface Act {
  actCode: string;
  actDescription: string;
}

export interface Section {
  actCode: string;
  sectionCode: string;
  sectionDescription: string;
}

export interface CrimeHead {
  crimeHeadId: number;
  crimeGroupName: string;
}

export interface CrimeSubHead {
  crimeSubHeadId: number;
  crimeHeadId: number;
  crimeHeadName: string;
}

export interface CaseCategory {
  caseCategoryId: number;
  lookupValue: string; // FIR, UDR, PAR, Zero FIR
}

export interface CaseStatus {
  caseStatusId: number;
  caseStatusName: string;
}

export interface Court {
  courtId: number;
  courtName: string;
  districtId: number;
}

/**
 * CrimeFIR - Main FIR/Case Record
 * Structured Crime Number: 1-digit(category) + 4-digit(district) + 4-digit(PS) + 4-digit(year) + 5-digit(serial)
 * Example: 10443000620260001 = FIR(1) Bengaluru(0444) PS(0006) 2026(year) 00001(serial)
 */
export interface CrimeFIR {
  caseMasterId: number;
  crimeNo: string;
  caseNo: string;
  crimeRegisteredDate: Date;
  policePersonId: number;
  policeStationId: number;
  caseCategoryId: number;
  gravityOffenceId: number;
  crimeMajorHeadId: number;
  crimeMinorHeadId: number;
  caseStatusId: number;
  courtId: number;
  incidentFromDate: Date;
  incidentToDate: Date;
  latitude?: number;
  longitude?: number;
  briefFacts: string;
}

export interface Complainant {
  complainantId: number;
  caseMasterId: number;
  complainantName: string;
  ageYear: number;
  occupationId: number;
  religionId: number;
  casteId: number;
  genderId: number;
}

export interface Victim {
  victimMasterId: number;
  caseMasterId: number;
  victimName: string;
  ageYear: number;
  genderId: number;
  victimPolice: boolean;
}

export interface Accused {
  accusedMasterId: number;
  caseMasterId: number;
  accusedName: string;
  ageYear: number;
  genderId: number;
  personId: string; // A1, A2, A3...
}

export interface ArrestRecord {
  arrestSurrenderId: number;
  caseMasterId: number;
  arrestDate: Date;
  accusedMasterId: number;
  ioId: number;
  courtId: number;
}

export interface Chargesheet {
  chargeshtId: number;
  caseMasterId: number;
  chargeshtDate: Date;
  chargeshtType: string; // A, B, C
}
