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
        return http.get('/api/v1/reports/weekly/current', config);
    }

    getReportOneWeek(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/reports/weekly', config);
    }
}

export default new ReportDataService();
