import type { Gender } from "@/features/patient-intake/patient-details";

export type DetailsInput = {
  patientId: string;
  age: string;
  gender: Gender | null;
};

export type DetailsErrors = Partial<Record<keyof DetailsInput, string>>;

const PATIENT_ID_PATTERN = /^[A-Za-z0-9-]{3,30}$/;

export function validateDetails(input: DetailsInput): DetailsErrors {
  const errors: DetailsErrors = {};

  if (!PATIENT_ID_PATTERN.test(input.patientId.trim())) {
    errors.patientId = "Enter your Patient ID using letters, numbers or dashes.";
  }

  const age = Number(input.age);
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    errors.age = "Enter your age in years, from 1 to 120.";
  }

  if (!input.gender) {
    errors.gender = "Please choose one option.";
  }

  return errors;
}
