import moment from "moment/moment";
export const disabledTimeChecker = (current, type) => {
    if (current) {
        const currentMoment = moment();

        const selectedMoment = moment(current.$d);
        console.log(selectedMoment)
        // Check if the year, month, and day of the selected date match the current date
        const isSameYear = selectedMoment.year() === currentMoment.year();
        const isSameMonth = selectedMoment.month() === currentMoment.month();
        const isSameDay = selectedMoment.date() === currentMoment.date();

        console.log(isSameDay, isSameMonth, isSameYear)

        if (type === 'start' && isSameYear && isSameMonth && isSameDay) {
            const currentHour = moment().hour();
            const currentMinute = moment().minute();

            // Disable hours before the current hour
            const disabledHours = Array.from({length: currentHour}, (_, i) => i);

            // Disable minutes before the current minute
            const disabledMinutes = Array.from({length: currentMinute}, (_, i) => i);

            return {
                disabledHours: () => disabledHours,
                disabledMinutes: () => disabledMinutes,
            };
        }
    }
    return [];
};

export const disabledDateChecker = (current) => {
    // Disable dates before the current date
    return current && current < moment().startOf('day');
};