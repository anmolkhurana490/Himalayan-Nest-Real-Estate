/**
 * Customer Account Dashboard Page
 * Main dashboard entry point - redirects to /account/dashboard
 */

import { redirect } from 'next/navigation';
import ROUTES from '@/config/constants/routes';

export default function AccountPage() {
    redirect(ROUTES.ACCOUNT.DASHBOARD);
}
