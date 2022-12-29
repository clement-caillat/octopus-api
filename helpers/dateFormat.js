exports.formatDate = date => {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000));

    let fulldate = date.toISOString();
    let formated = fulldate.split('T');
    formated[1] = formated[1].split('.')[0];
    return formated.join(' ');
};


exports.getCurrentTimestamp = () => {
    const date = new Date();
    
    let timestamp = date.getTime() / 1000;
    timestamp = timestamp.toString().split('.')[0];

    return timestamp;
};