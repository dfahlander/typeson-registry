export default {
    arrayNonindexKeys: {
        testPlainObjects: true,
        test (x, stateObj) {
            if (Array.isArray(x)) {
                stateObj.iterateIn = 'object';
                stateObj.addLength = true;
                return true;
            }
            return false;
        },
        revive (o) {
            const arr = [];
            // No map here as may be a sparse array (including
            //   with `length` set)
            Object.entries(o).forEach(([key, val]) => {
                arr[key] = val;
            });
            return arr;
        }
    }
};
