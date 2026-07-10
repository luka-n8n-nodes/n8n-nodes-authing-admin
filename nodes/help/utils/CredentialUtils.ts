import { ICredentialDataDecryptedObject } from 'n8n-workflow';

export const AdminRole = {
	SuperAdmin: 'superAdmin',
	CollaboratorAdmin: 'collaboratorAdmin',
} as const;

export function getUserPoolId(credentials: ICredentialDataDecryptedObject): string {
	const role = (credentials.role as string) || AdminRole.SuperAdmin;
	if (role === AdminRole.CollaboratorAdmin) {
		return credentials.userPoolId as string;
	}
	return credentials.accessKeyId as string;
}
