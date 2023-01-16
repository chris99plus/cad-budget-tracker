import http from '../http-common';

class ReportDataService {
    getReportForOneDay(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/reports/daily/today', config);
    }

    getReportForCurrentWeek(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/cashbooks/:cashbookId/reports/weekly/current', config);
    }

    getReportOneWeek(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/cashbooks/:cashbookId/reports/weekly', config);
    }

    deleteReport(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.delete('/api/v1/reports/:reportId', config);
    }
}

export default new ReportDataService();
