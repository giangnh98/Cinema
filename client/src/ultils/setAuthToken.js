const setAuthHeaders = headersObject => {
    let headers = { ...headersObject };
    if (localStorage.token) {
        headers = {
            ...headers,
            Authorization: `Bearer ${localStorage.token}`,
        };
    }
    return headers;
};

export default setAuthHeaders;