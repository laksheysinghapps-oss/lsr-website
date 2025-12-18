// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQprjikOLVxi7IAO1qXsjIEVMRAjo3H_lA0XP37geLl2bYZBdVgACBV4dFACt748cj8w/exec';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  project?: string;
  message?: string;
  source?: string;
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // With no-cors mode, we can't read the response, so we assume success
    // The Google Script will handle validation and email notification
    return { success: true };
  } catch (error) {
    console.error('Lead submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form'
    };
  }
}
