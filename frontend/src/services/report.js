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

    getReportForCurrentMonth(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/reports/monthly/current', config);
    }

    getReportOneWeek(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/reports/weekly', config);
    }
    getReportAllWeekly(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/reports/weekly/all', config);
    }
}

export default new ReportDataService();
