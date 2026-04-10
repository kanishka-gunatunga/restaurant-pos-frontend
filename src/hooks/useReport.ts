import { useMutation } from "@tanstack/react-query";
import * as reportService from "@/services/reportService";
import type { GetReportParams } from "@/services/reportService";

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (params: GetReportParams) => reportService.getReportData(params),
  });
};
