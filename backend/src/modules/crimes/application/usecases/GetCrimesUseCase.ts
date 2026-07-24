import { prisma } from '@/config/database';
import { buildPagination, buildPaginatedResponse } from '@/shared/utils/pagination';
import type { PaginationQuery } from '@/shared/types';

export interface CrimeFilters extends PaginationQuery {
  crimeNo?: string;
  policeStationId?: number;
  crimeMajorHeadId?: number;
  caseStatusId?: number;
  gravityOffenceId?: number;
  fromDate?: string;
  toDate?: string;
  districtId?: number;
}

export class GetCrimesUseCase {
  async execute(filters: CrimeFilters) {
    const { page, limit, skip } = buildPagination(filters);

    const where: Record<string, unknown> = {};

    if (filters.crimeNo) {
      where.crimeNo = { contains: filters.crimeNo, mode: 'insensitive' };
    }
    if (filters.policeStationId) {
      where.policeStationId = filters.policeStationId;
    }
    if (filters.crimeMajorHeadId) {
      where.crimeMajorHeadId = filters.crimeMajorHeadId;
    }
    if (filters.caseStatusId) {
      where.caseStatusId = filters.caseStatusId;
    }
    if (filters.gravityOffenceId) {
      where.gravityOffenceId = filters.gravityOffenceId;
    }
    if (filters.fromDate) {
      where.crimeRegisteredDate = {
        ...(typeof where.crimeRegisteredDate === 'object' && where.crimeRegisteredDate !== null
          ? where.crimeRegisteredDate
          : {}),
        gte: new Date(filters.fromDate),
      };
    }
    if (filters.toDate) {
      where.crimeRegisteredDate = {
        ...(typeof where.crimeRegisteredDate === 'object' && where.crimeRegisteredDate !== null
          ? where.crimeRegisteredDate
          : {}),
        lte: new Date(filters.toDate),
      };
    }

    const [total, crimes] = await Promise.all([
      prisma.crimeFIR.count({ where }),
      prisma.crimeFIR.findMany({
        where,
        skip,
        take: limit,
        orderBy: { crimeRegisteredDate: 'desc' },
        include: {
          policeStation: { select: { unitId: true, unitName: true } },
          caseStatus: { select: { caseStatusId: true, caseStatusName: true } },
          majorHead: { select: { crimeHeadId: true, crimeGroupName: true } },
          minorHead: { select: { crimeSubHeadId: true, crimeHeadName: true } },
          gravityOffence: { select: { gravityOffenceId: true, lookupValue: true } },
          caseCategory: { select: { caseCategoryId: true, lookupValue: true } },
          _count: { select: { accused: true, victims: true, arrests: true } },
        },
      }),
    ]);

    return buildPaginatedResponse(crimes, total, page, limit);
  }
}
