import { SocialPlatform } from "@prisma/client";

export interface SocialLinkForm {
  platform: SocialPlatform;
  url: string;
}

export interface AssociationFormData {
  name: string;
  logo?: File;
  slug: string;
  color: string;
  summary: string;
  description: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  socials?: SocialLinkForm[];
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof AssociationFormData]?: string[];
  };
  inputs?: AssociationFormData;
}
