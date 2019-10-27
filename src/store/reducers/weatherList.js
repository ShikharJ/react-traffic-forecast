const initialState = {
    list: [],
    city: {
        coord: { lat: 40.7306, lon: -73.9867},
        country: 'US',
        id: 5128581,
        name: 'New York'
    },
    request: false,
    error: null
};

export default function (state = initialState, action) {
    const { type, data } = action;

    switch (type) {
        case 'FETCH_WEATHER':
            return {
                ...state,
                request: true,
                error: false
            };

        case 'CANCEL_FETCH_WEATHER':
            return {
                ...state,
                request: false
            };

        case 'FETCH_SUCCESS_WEATHER':
            return {
                ...data,
                request: false,
                error: false
            };

        case 'FETCH_FAILED_WEATHER':
            return {
                ...state,
                request: false,
                error: action.data
            };

        case 'CLEAN_WEATHER':
            return initialState;

        default:
            return state;
    }
}