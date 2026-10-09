export type Gender = "male" | "female";

export type PatientDetails = {
  patientId: string;
  age: number;
  gender: Gender;
};

export const GENDER_OPTIONS: readonly { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];
