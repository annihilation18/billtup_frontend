// Simplified cn utility to avoid dependency issues
export type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const result = cn(...input);
      if (result) classes.push(result);
    }
  }
  
  // Simple deduplication - keep last occurrence of each class
  const classMap = new Map<string, boolean>();
  const result: string[] = [];
  
  for (const cls of classes.join(' ').split(' ')) {
    if (cls) classMap.set(cls, true);
  }
  
  return Array.from(classMap.keys()).join(' ');
}
