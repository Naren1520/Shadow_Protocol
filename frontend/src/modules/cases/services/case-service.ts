import { apiClient } from '@/shared/services/api-client';

export const caseService = {
  async getCases(query?: { caseNo?: string; crimeNo?: string; caseStatusId?: number }) {
    return apiClient.get<any>('/cases', { params: query });
  },

  async getCaseDetails(caseMasterId: number) {
    return apiClient.get<any>(`/cases/${caseMasterId}`);
  },
};
