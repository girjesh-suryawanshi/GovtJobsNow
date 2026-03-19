import { Building2, Shield, Landmark, GraduationCap, MapPin, Users, Briefcase } from "lucide-react";

interface OrganizationLogoProps {
  department: string;
  recruitingOrganization?: string | null;
  className?: string;
}

export default function OrganizationLogo({ department, recruitingOrganization, className = "h-8 w-8" }: OrganizationLogoProps) {
  const getLogoComponent = (dept: string, org?: string | null) => {
    const combined = `${dept} ${org || ''}`.toLowerCase();
    
    // Government Departments
    if (combined.includes('ssc') || combined.includes('staff selection')) {
      return <Shield className={`${className} text-blue-600`} />;
    }
    if (combined.includes('upsc') || combined.includes('union public service')) {
      return <Shield className={`${className} text-purple-600`} />;
    }
    if (combined.includes('railway') || combined.includes('rrb')) {
      return <svg className={`${className} text-orange-600`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>;
    }
    
    // Defense Services
    if (combined.includes('army') || combined.includes('military')) {
      return <Shield className={`${className} text-green-700`} />;
    }
    if (combined.includes('navy') || combined.includes('naval')) {
      return <Shield className={`${className} text-blue-700`} />;
    }
    if (combined.includes('air force') || combined.includes('airforce')) {
      return <Shield className={`${className} text-sky-600`} />;
    }
    
    // Research Organizations
    if (combined.includes('isro') || combined.includes('space')) {
      return <svg className={`${className} text-indigo-600`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>;
    }
    if (combined.includes('drdo') || combined.includes('defence research')) {
      return <Shield className={`${className} text-red-600`} />;
    }
    
    // Banking & Financial
    if (combined.includes('bank') || combined.includes('rbi') || combined.includes('reserve bank')) {
      return <Landmark className={`${className} text-green-600`} />;
    }
    if (combined.includes('ibps') || combined.includes('banking personnel')) {
      return <Landmark className={`${className} text-blue-500`} />;
    }
    
    // State Governments
    if (combined.includes('delhi') || combined.includes('state') || combined.includes('government')) {
      return <Building2 className={`${className} text-amber-600`} />;
    }
    
    // Educational
    if (combined.includes('education') || combined.includes('university') || combined.includes('teaching')) {
      return <GraduationCap className={`${className} text-purple-500`} />;
    }
    
    // Default fallback
    return <Building2 className={`${className} text-gray-500`} />;
  };

  return getLogoComponent(department);
}