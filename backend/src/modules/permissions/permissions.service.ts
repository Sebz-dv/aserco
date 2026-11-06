export type Permission = {
  id: number;
  name: string;
  description?: string;
};

export async function listPermissions(): Promise<Permission[]> {
  return [];
}
