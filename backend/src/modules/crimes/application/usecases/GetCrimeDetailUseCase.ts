import { prisma } from '@/config/database';
import { NotFoundException } from '@/shared/domain/exceptions';

export class GetCrimeDetailUseCase {
  async execute(caseMasterId: number) {
    const crime = await prisma.crimeFIR.findUnique({
      where: { caseMasterId },
      include: {
        policeStation: true,
        caseStatus: true,
        majorHead: true,
        minorHead: true,
        gravityOffence: true,
        caseCategory: true,
        court: true,
        registeredBy: {
          include: {
            rank: true,
            designation: true,
          },
        },
        complainants: {
          include: {
            occupation: true,
            religion: true,
            caste: true,
          },
        },
        victims: true,
        accused: true,
        actSections: {
          include: {
            act: true,
            section: true,
          },
        },
        arrests: {
          include: {
            accused: true,
            investigatingOfficer: { include: { rank: true } },
          },
        },
        chargesheet: true,
      },
    });

    if (!crime) {
      throw new NotFoundException('CrimeFIR', caseMasterId);
    }

    return crime;
  }
}
