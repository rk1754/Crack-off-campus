
export interface User {
  id: string; // Changed from number to string to match the UUID format in the model
  name: string;
  email: string;
  role: string;
  subscription: string;
  skills?: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min: number;
  salary_max: number;
  description: string;
  status: 'open' | 'closed';
  application_url?: string;
  subscription_type: string;
}
