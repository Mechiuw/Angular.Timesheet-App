export const API_BASE_URL = 'https://api.yusharwz.my.id/api/v1';
export const API_ENDPOINT = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/login`,
        CHANGE_PASSWORD: `${API_BASE_URL}/accounts/change-password`,
        UPDATE_ACCOUNTS: `${API_BASE_URL}/accounts/`,
        DETAIL_PROFILE: `${API_BASE_URL}/accounts/profile`,
        ACTIVATION: `${API_BASE_URL}/accounts/activate`,
        UPLOAD_SIGNATURE: `${API_BASE_URL}/accounts/profile/upload-signature`
    },
    WORK :`${API_BASE_URL}/admin/works`,

    USERS: `${API_BASE_URL}/admin/accounts?paging=1&rowsPerPage=1000`,

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