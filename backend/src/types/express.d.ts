import User from '../models/user.model';
import Admin from '../models/admin.model';

declare global {
  namespace Express {
    interface User {
      id: string;
      subscription_type: string;
      email: string;
      phone_number: string;
    }
    
    interface Request {
      user?: { id: string; email: string; subscription_type: string; phone_number: string };
      admin?: { id: string; email: string };
    }
  }
}