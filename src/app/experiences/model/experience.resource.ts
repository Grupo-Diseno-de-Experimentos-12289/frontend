export interface ExperienceResource {
  id: number;
  title: string;
  description: string;
  agencyId: number;
  category?: any;
  destinationId?: number;
  duration?: string;
  meetingPoint?: string;
}
