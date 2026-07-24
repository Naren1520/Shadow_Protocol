import { apiClient } from '@/shared/services/api-client';
import type { CrimeFIR } from '@/shared/types/police-schema';

export interface CrimeSearchQuery {
  crimeNo?: string;
  policeStationId?: number;
  crimeHeadId?: number;
  caseStatusId?: number;
  fromDate?: string;
  toDate?: string;
}

export const crimeService = {
  async getCrimeDashboardMetrics() {
    return apiClient.get('/crimes/dashboard');
  },

  async searchCrimes(query: CrimeSearchQuery) {
    return apiClient.get<CrimeFIR[]>('/crimes/search', { params: query });
  },

  async getCrimeDetails(caseMasterId: number) {
    return apiClient.get<CrimeFIR>(`/crimes/${caseMasterId}`);
  },
};
