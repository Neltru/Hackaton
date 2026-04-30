export interface DriveFileRef {
  fileId: string;
  fileName: string;
  mimeType: string;
  viewUrl: string;
  downloadUrl?: string;
  uploadedAt?: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface Certificate {
  id?: string;
  title: string;
  institution: string;
  issueDate?: string;
  expiresAt?: string;
  credentialId?: string;
  file?: DriveFileRef;
}

export interface AlumniProfile {
  id?: string;
  fullName: string;
  institutionalEmail: string;
  personalEmail?: string;
  phone?: string;
  summary?: string;
  careerCode?: string;
  careerName?: string;
  entryYear?: number;
  photo?: DriveFileRef;
  cv?: DriveFileRef;
  experiences: WorkExperience[];
  certificates: Certificate[];
}

export type AlumniProfileUpdate = Omit<
  AlumniProfile,
  'id' | 'careerCode' | 'careerName' | 'entryYear'
>;
