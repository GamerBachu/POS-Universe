

export const getIsDangerousAction = (status: string) => {
    const dangerStates = ['VOIDED', 'CANCELLED', 'REFUNDED'];
    return dangerStates.includes(status.toUpperCase());
};