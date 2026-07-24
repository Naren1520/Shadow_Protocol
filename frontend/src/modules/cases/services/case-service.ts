import { apiClient } from '@/shared/services/api-client';
import type { CrimeFIR } from '@/shared/types/police-schema';

export const caseService = {
  async getCases(query?: { caseNo?: string }) {
    return apiClient.get<CrimeFIR[]>('/cases', { params: query });
  },

  async getCaseDetails(caseMasterId: number) {
    return apiClient.get<CrimeFIR>(`/cases/${caseMasterId}`);
  },
};
