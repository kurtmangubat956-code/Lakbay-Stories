import SiteLayout from '@/Layouts/SiteLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const card = 'rounded-2xl border border-cream-200 bg-cream-50 p-6 sm:p-8';

    return (
        <SiteLayout>
            <Head title="Profile" />

            <div className="container-page max-w-3xl py-12">
                <p className="eyebrow">Account</p>
                <h1 className="mt-2 font-serif text-4xl text-ink">Profile</h1>

                <div className="mt-8 space-y-6">
                    <div className={card}>
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
                    </div>
                    <div className={card}>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                    <div className={card}>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
