const handleError = err => {
    console.error(err);
    return false;
};

class IntervalController {
    constructor (intervalKey) {
        this.intervalKey = intervalKey;
    }

    set interval (setIntervalObjName) {
        this.setIntervalObj = setIntervalObjName;
    }

    resetInterval () {
        if (!this.setIntervalObj) return false;
        deleteInterval();
    }

    deleteInterval() {
        if (!this.setIntervalObj) return false;
        clearInterval(this.setIntervalObj);
        delete this.setIntervalObj;
    }
}

module.exports = {
    IntervalController
};
