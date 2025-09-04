export interface AssociationFormData {
  name: string;
  slug: string;
  color: string;
  summary: string;
  description: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof AssociationFormData]?: string[];
  };
  inputs?: AssociationFormData;
}
