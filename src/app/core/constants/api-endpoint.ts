export const API_BASE_URL = '/api/v1';
export const API_ENDPOINT = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/login`,
        CHANGE_PASSWORD: `${API_BASE_URL}/accounts/change-password`,
        UPDATE_ACCOUNTS: `${API_BASE_URL}/accounts/update-account`,
        DETAIL_PROFILE: `${API_BASE_URL}/accounts/profile`,
    },
    WORK :`${API_BASE_URL}/admin/works`,

    TIMESHEET: `${API_BASE_URL}/timesheets`,

    MANAGER:{
        APPROVE:`${API_BASE_URL}/manager/approve/timesheets`,
        REJECT:`${API_BASE_URL}/manager/reject/timesheets`
    },

    BENEFIT:{
        APPROVE:`${API_BASE_URL}/benefit/approve/timesheets`,
        REJECT:`${API_BASE_URL}/benefit/reject/timesheets`
    },

}