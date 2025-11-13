/**
 * Format phone number to XXX-XXX-XXXX format
 * Handles both raw numbers and already formatted numbers
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    // Limit to 10 digits
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};
