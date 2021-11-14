export const email = () => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (text) => emailRegex.test(text.toLowerCase());    
}

export const required = () => {
    return minLength(1);
}

export const minLength = (value) => {
    return (text) => text.length >= value;
}
