export function formatDate(dateString: string) {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${year}-${day}-${month} ${hours}:${minutes}`;
}

export function formatToScheduleX(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month (1-12)
    const day = String(date.getDate()).padStart(2, "0"); // Day (01-31)
    const hours = String(date.getHours()).padStart(2, "0"); // Hours (00-23)
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutes (00-59)
  
    return `${year}-${month}-${day} ${hours}:${minutes}`; // Format: "YYYY-MM-DD HH:MM"
  }