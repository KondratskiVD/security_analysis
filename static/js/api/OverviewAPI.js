const ApiFetchReports = async (startDate) => {
    const res = await fetch(`/api/v1/security_analysis/reports/${getSelectedProjectId()}/?${new URLSearchParams(startDate)}`,
        {
        method: 'GET',
    })
    return res.json();
}

const ApiFetchTests = async () => {
    const res = await fetch(`/api/v1/security_analysis/tests/${getSelectedProjectId()}`, {
        method: 'GET',
    })
    return res.json();
}
