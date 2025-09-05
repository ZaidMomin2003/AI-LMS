
import { SchoolDashboardClient } from './SchoolDashboardClient';
import { getSchoolDataForDashboard } from './actions';

export default async function SchoolDashboardPage() {
  const { school, users, error } = await getSchoolDataForDashboard();

  if (error) {
    // This could be a more user-friendly error component
    return <div className="p-8 text-destructive">{error}</div>;
  }
  
  if (!school) {
    return <div className="p-8">School not found. Please log in again.</div>;
  }
  
  return <SchoolDashboardClient initialSchool={school} initialUsers={users} />;
}
