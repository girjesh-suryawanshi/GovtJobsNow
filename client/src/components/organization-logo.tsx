import { Building2, Shield, Landmark, GraduationCap, MapPin, Users, Briefcase } from "lucide-react";

interface OrganizationLogoProps {
  department: string;
  className?: string;
}

export default function OrganizationLogo({ department, className = "h-8 w-8" }: OrganizationLogoProps) {
  const getLogoComponent = (dept: string) => {
    const deptLower = dept.toLowerCase();
    
    // Government Departments
    if (deptLower.includes('ssc') || deptLower.includes('staff selection')) {
      return <Shield className={`${className} text-blue-600`} />;
    }
    if (deptLower.includes('upsc') || deptLower.includes('union public service')) {
      return <Shield className={`${className} text-purple-600`} />;
    }
    if (deptLower.includes('railway') || deptLower.includes('rrb')) {
      return <svg className={`${className} text-orange-600`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>;
    }
    
    // Defense Services
    if (deptLower.includes('army') || deptLower.includes('military')) {
      return <Shield className={`${className} text-green-700`} />;
    }
    if (deptLower.includes('navy') || deptLower.includes('naval')) {
      return <Shield className={`${className} text-blue-700`} />;
    }
    if (deptLower.includes('air force') || deptLower.includes('airforce')) {
      return <Shield className={`${className} text-sky-600`} />;
    }
    
    // Research Organizations
    if (deptLower.includes('isro') || deptLower.includes('space')) {
      return <svg className={`${className} text-indigo-600`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>;
    }
    if (deptLower.includes('drdo') || deptLower.includes('defence research')) {
      return <Shield className={`${className} text-red-600`} />;
    }
    
    // Banking & Financial
    if (deptLower.includes('bank') || deptLower.includes('rbi') || deptLower.includes('reserve bank')) {
      return <Landmark className={`${className} text-green-600`} />;
    }
    if (deptLower.includes('ibps') || deptLower.includes('banking personnel')) {
      return <Landmark className={`${className} text-blue-500`} />;
    }
    
    // State Governments
    if (deptLower.includes('delhi') || deptLower.includes('state') || deptLower.includes('government')) {
      return <Building2 className={`${className} text-amber-600`} />;
    }
    
    // Educational
    if (deptLower.includes('education') || deptLower.includes('university') || deptLower.includes('teaching')) {
      return <GraduationCap className={`${className} text-purple-500`} />;
    }
    
    // Default fallback
    return <Building2 className={`${className} text-gray-500`} />;
  };

  return getLogoComponent(department);
}