export async function fetchCourses() {
  const response = await fetch('/api/courses');
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
}
