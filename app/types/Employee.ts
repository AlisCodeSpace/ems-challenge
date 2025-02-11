export interface Employee {
    id: number;
    full_name: string;
    email: string;
    job_title: string;
}
  
export interface SingleEmployee extends Employee {
    department?: string;
    salary?: number;
    date_of_birth?: string;
    start_date?: string;
    end_date?: string;
}
  