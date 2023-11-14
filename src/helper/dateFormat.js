import moment from "moment/moment";
export const disabledTimeChecker = (current, type) => {
    if (current) {
        const currentMoment = moment();

        const selectedMoment = moment(current.$d);
        // Check if the year, month, and day of the selected date match the current date
        const isSameYear = selectedMoment.year() === currentMoment.year();
        const isSameMonth = selectedMoment.month() === currentMoment.month();
        const isSameDay = selectedMoment.date() === currentMoment.date();

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

const WEEKLY = 'Week';
const YEARLY = 'Year';
const MONTHLY = 'Month';
export const getDateFormat = (date, selectedXAxis) => {
    if (selectedXAxis === MONTHLY) {
        return moment(date).format('MMMM');
    } else if (selectedXAxis === YEARLY) {
        return moment(date).format('YYYY');
    } else if (selectedXAxis === WEEKLY) {
        return moment(date).format('YYYY-MM-DD'); // Adjust the format for weeks
    }
};