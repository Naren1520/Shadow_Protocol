import { apiClient } from '@/shared/services/api-client';

export interface CrimeSearchQuery {
  crimeNo?: string;
  policeStationId?: number;
  crimeHeadId?: number;
  caseStatusId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export const crimeService = {
  async getCrimeDashboardMetrics() {
    return apiClient.get('/crimes/dashboard');
  },

  async searchCrimes(query: CrimeSearchQuery) {
    return apiClient.get<any>('/crimes/search', { params: query });
  },

  async getCrimeDetails(caseMasterId: number) {
    return apiClient.get<any>(`/crimes/${caseMasterId}`);
  },
};
