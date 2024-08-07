// export const API_BASE_URL = 'http://10.10.102.46:8080/api/v1';
// export const API_BASE_URL = 'https://api.yusharwz.my.id/api/v1';
// export const API_BASE_URL = 'http://192.168.1.22:8080/api/v1';
export const API_BASE_URL = 'https://sure-pika-easy.ngrok-free.app/api/v1';
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
    ROLES: `${API_BASE_URL}/admin/roles`,

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