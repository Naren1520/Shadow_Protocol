import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed States
  await prisma.state.upsert({
    where: { stateId: 29 },
    update: {},
    create: { stateId: 29, stateName: 'Karnataka', nationalityId: 1 },
  });

  // Seed Districts
  const districts = [
    { districtId: 441, districtName: 'Bengaluru Urban', stateId: 29 },
    { districtId: 442, districtName: 'Bengaluru Rural', stateId: 29 },
    { districtId: 443, districtName: 'Mysuru', stateId: 29 },
    { districtId: 444, districtName: 'Dharwad', stateId: 29 },
    { districtId: 445, districtName: 'Belagavi', stateId: 29 },
    { districtId: 446, districtName: 'Hubballi', stateId: 29 },
    { districtId: 447, districtName: 'Shivamogga', stateId: 29 },
    { districtId: 448, districtName: 'Mangaluru', stateId: 29 },
  ];
  for (const d of districts) {
    await prisma.district.upsert({ where: { districtId: d.districtId }, update: {}, create: d });
  }

  // Seed Unit Type
  await prisma.unitType.upsert({
    where: { unitTypeId: 1 },
    update: {},
    create: { unitTypeId: 1, unitTypeName: 'City Police Station', cityDistState: 'City', hierarchy: 3 },
  });

  // Seed Police Station
  await prisma.policeStation.upsert({
    where: { unitId: 6 },
    update: {},
    create: {
      unitId: 6,
      unitName: 'Cubbon Park PS',
      typeId: 1,
      nationalityId: 1,
      stateId: 29,
      districtId: 441,
    },
  });

  // Seed Rank
  await prisma.rank.upsert({
    where: { rankId: 5 },
    update: {},
    create: { rankId: 5, rankName: 'Sub-Inspector', hierarchy: 5 },
  });

  // Seed Designation
  await prisma.designation.upsert({
    where: { designationId: 10 },
    update: {},
    create: { designationId: 10, designationName: 'Investigating Officer', sortOrder: 10 },
  });

  // Seed Police Officer
  await prisma.policeOfficer.upsert({
    where: { employeeId: 1001 },
    update: {},
    create: {
      employeeId: 1001,
      districtId: 441,
      unitId: 6,
      rankId: 5,
      designationId: 10,
      kgId: 'KG-2021-04521',
      firstName: 'Kiran Kumar',
      employeeDob: new Date('1992-05-15'),
      genderId: 1,
      bloodGroupId: 2,
      appointmentDate: new Date('2021-03-15'),
    },
  });

  // Seed a second officer for the seeded officer user
  await prisma.policeOfficer.upsert({
    where: { employeeId: 1002 },
    update: {},
    create: {
      employeeId: 1002,
      districtId: 441,
      unitId: 6,
      rankId: 5,
      designationId: 10,
      kgId: 'KG-2021-04522',
      firstName: 'Priya Sharma',
      employeeDob: new Date('1993-08-22'),
      genderId: 2,
      bloodGroupId: 1,
      appointmentDate: new Date('2022-01-10'),
    },
  });

  // Seed Case Categories
  const categories = [
    { caseCategoryId: 1, lookupValue: 'FIR' },
    { caseCategoryId: 2, lookupValue: 'UDR' },
    { caseCategoryId: 3, lookupValue: 'PAR' },
    { caseCategoryId: 4, lookupValue: 'Zero FIR' },
  ];
  for (const c of categories) {
    await prisma.caseCategory.upsert({ where: { caseCategoryId: c.caseCategoryId }, update: {}, create: c });
  }

  // Seed Case Statuses
  const statuses = [
    { caseStatusId: 1, caseStatusName: 'Open' },
    { caseStatusId: 2, caseStatusName: 'Under Investigation' },
    { caseStatusId: 3, caseStatusName: 'Chargesheet Filed' },
    { caseStatusId: 4, caseStatusName: 'Pending Trial' },
    { caseStatusId: 5, caseStatusName: 'Closed' },
    { caseStatusId: 6, caseStatusName: 'Acquitted' },
    { caseStatusId: 7, caseStatusName: 'Convicted' },
  ];
  for (const s of statuses) {
    await prisma.caseStatus.upsert({ where: { caseStatusId: s.caseStatusId }, update: {}, create: s });
  }

  // Seed Gravity Offences
  const gravities = [
    { gravityOffenceId: 1, lookupValue: 'Heinous' },
    { gravityOffenceId: 2, lookupValue: 'Non-Heinous' },
  ];
  for (const g of gravities) {
    await prisma.gravityOffence.upsert({ where: { gravityOffenceId: g.gravityOffenceId }, update: {}, create: g });
  }

  // Seed Court
  await prisma.court.upsert({
    where: { courtId: 1 },
    update: {},
    create: { courtId: 1, courtName: 'Additional Chief Metropolitan Magistrate Court', districtId: 441, stateId: 29 },
  });

  // Seed Crime Heads
  const crimeHeads = [
    { crimeHeadId: 1, crimeGroupName: 'Crimes Against Body' },
    { crimeHeadId: 2, crimeGroupName: 'Crimes Against Property' },
    { crimeHeadId: 3, crimeGroupName: 'Crimes Against Women' },
    { crimeHeadId: 4, crimeGroupName: 'Crimes Against Children' },
    { crimeHeadId: 5, crimeGroupName: 'NDPS Act' },
    { crimeHeadId: 6, crimeGroupName: 'Economic Offences' },
    { crimeHeadId: 7, crimeGroupName: 'Crimes Related to Documents' },
  ];
  for (const h of crimeHeads) {
    await prisma.crimeHead.upsert({ where: { crimeHeadId: h.crimeHeadId }, update: {}, create: h });
  }

  // Seed Crime Sub Heads
  const subHeads = [
    { crimeSubHeadId: 101, crimeHeadId: 1, crimeHeadName: 'Murder', seqId: 1 },
    { crimeSubHeadId: 102, crimeHeadId: 1, crimeHeadName: 'Attempt to Murder', seqId: 2 },
    { crimeSubHeadId: 103, crimeHeadId: 1, crimeHeadName: 'Assault', seqId: 3 },
    { crimeSubHeadId: 201, crimeHeadId: 2, crimeHeadName: 'Robbery', seqId: 1 },
    { crimeSubHeadId: 202, crimeHeadId: 2, crimeHeadName: 'Theft', seqId: 2 },
    { crimeSubHeadId: 203, crimeHeadId: 2, crimeHeadName: 'Dacoity', seqId: 3 },
    { crimeSubHeadId: 501, crimeHeadId: 5, crimeHeadName: 'NDPS Possession', seqId: 1 },
    { crimeSubHeadId: 502, crimeHeadId: 5, crimeHeadName: 'NDPS Trafficking', seqId: 2 },
  ];
  for (const s of subHeads) {
    await prisma.crimeSubHead.upsert({ where: { crimeSubHeadId: s.crimeSubHeadId }, update: {}, create: s });
  }

  // Seed Acts
  const acts = [
    { actCode: 'IPC', actDescription: 'Indian Penal Code', shortName: 'IPC' },
    { actCode: 'NDPS', actDescription: 'Narcotic Drugs and Psychotropic Substances Act 1985', shortName: 'NDPS' },
    { actCode: 'PCR', actDescription: 'Protection of Civil Rights Act', shortName: 'PCR' },
    { actCode: 'POCSO', actDescription: 'Protection of Children from Sexual Offences Act', shortName: 'POCSO' },
  ];
  for (const a of acts) {
    await prisma.act.upsert({ where: { actCode: a.actCode }, update: {}, create: a });
  }

  // Seed Sections
  const sections = [
    { actCode: 'IPC', sectionCode: '302', sectionDescription: 'Murder' },
    { actCode: 'IPC', sectionCode: '307', sectionDescription: 'Attempt to Murder' },
    { actCode: 'IPC', sectionCode: '392', sectionDescription: 'Robbery' },
    { actCode: 'IPC', sectionCode: '397', sectionDescription: 'Robbery with attempt to cause death' },
    { actCode: 'IPC', sectionCode: '379', sectionDescription: 'Theft' },
    { actCode: 'IPC', sectionCode: '395', sectionDescription: 'Dacoity' },
    { actCode: 'IPC', sectionCode: '354', sectionDescription: 'Assault or criminal force on woman' },
    { actCode: 'NDPS', sectionCode: '20', sectionDescription: 'Contravention in relation to cannabis plant' },
    { actCode: 'NDPS', sectionCode: '21', sectionDescription: 'Contravention in relation to manufactured drugs' },
  ];
  for (const s of sections) {
    await prisma.section.upsert({
      where: { actCode_sectionCode: { actCode: s.actCode, sectionCode: s.sectionCode } },
      update: {},
      create: s,
    });
  }

  // Seed Occupations, Religions, Castes
  await prisma.occupation.upsert({ where: { occupationId: 1 }, update: {}, create: { occupationId: 1, occupationName: 'Business' } });
  await prisma.occupation.upsert({ where: { occupationId: 2 }, update: {}, create: { occupationId: 2, occupationName: 'Service' } });
  await prisma.occupation.upsert({ where: { occupationId: 3 }, update: {}, create: { occupationId: 3, occupationName: 'Labour' } });
  await prisma.religion.upsert({ where: { religionId: 1 }, update: {}, create: { religionId: 1, religionName: 'Hindu' } });
  await prisma.religion.upsert({ where: { religionId: 2 }, update: {}, create: { religionId: 2, religionName: 'Muslim' } });
  await prisma.caste.upsert({ where: { casteId: 1 }, update: {}, create: { casteId: 1, casteName: 'General' } });

  // Seed a sample FIR
  await prisma.crimeFIR.upsert({
    where: { caseMasterId: 1 },
    update: {},
    create: {
      caseMasterId: 1,
      crimeNo: '10441000620260001',
      caseNo: '441000620260001',
      crimeRegisteredDate: new Date('2026-07-24T09:32:00Z'),
      policePersonId: 1001,
      policeStationId: 6,
      caseCategoryId: 1,
      gravityOffenceId: 1,
      crimeMajorHeadId: 2,
      crimeMinorHeadId: 201,
      caseStatusId: 1,
      courtId: 1,
      incidentFromDate: new Date('2026-07-24T02:15:00Z'),
      incidentToDate: new Date('2026-07-24T02:45:00Z'),
      infoReceivedPsDate: new Date('2026-07-24T08:00:00Z'),
      latitude: 12.9716,
      longitude: 77.5946,
      briefFacts: 'Two unidentified persons on motorcycle snatched mobile phone and wallet near Cubbon Park. Accused fled towards MG Road.',
    },
  });

  // Seed sample accused
  await prisma.accused.upsert({
    where: { accusedMasterId: 1 },
    update: {},
    create: {
      accusedMasterId: 1,
      caseMasterId: 1,
      accusedName: 'Unknown',
      ageYear: 0,
      genderId: 1,
      personId: 'A1',
    },
  });

  // Seed complainant
  await prisma.complainant.upsert({
    where: { complainantId: 1 },
    update: {},
    create: {
      complainantId: 1,
      caseMasterId: 1,
      complainantName: 'Aravind Sharma',
      ageYear: 34,
      occupationId: 2,
      religionId: 1,
      casteId: 1,
      genderId: 1,
    },
  });

  // Seed act section for the FIR
  await prisma.crimeActSection.upsert({
    where: { caseMasterId_actCode_sectionCode: { caseMasterId: 1, actCode: 'IPC', sectionCode: '392' } },
    update: {},
    create: {
      caseMasterId: 1,
      actCode: 'IPC',
      sectionCode: '392',
      actOrderId: 1,
      sectionOrderId: 1,
    },
  });

  // Seed system user (admin)
  const passwordHash = await bcrypt.hash('Admin@1234!', 12);
  await prisma.systemUser.upsert({
    where: { email: 'admin@ksp.gov.in' },
    update: {},
    create: {
      email: 'admin@ksp.gov.in',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      employeeId: 1001,
    },
  });

  // Seed officer user
  const officerHash = await bcrypt.hash('Officer@1234!', 12);
  await prisma.systemUser.upsert({
    where: { email: 'kiran.kumar@ksp.gov.in' },
    update: {},
    create: {
      email: 'kiran.kumar@ksp.gov.in',
      passwordHash: officerHash,
      role: 'SUB_INSPECTOR',
      isActive: true,
      employeeId: 1002,
    },
  });

  console.log('✅ Seeding complete!');
  console.log('');
  console.log('Test credentials:');
  console.log('  Admin:   admin@ksp.gov.in      / Admin@1234!');
  console.log('  Officer: kiran.kumar@ksp.gov.in / Officer@1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
